import { Component } from '@angular/core';
import { SignalingClient } from 'amazon-kinesis-video-streams-webrtc';
import { KinesisVideo, KinesisVideoSignalingChannels } from 'aws-sdk';
import * as aws from 'aws-sdk';
import * as KVSWebRTC from 'amazon-kinesis-video-streams-webrtc';
import { kStringMaxLength } from 'buffer';

enum test
{
    MASTER = 'MASTER',
    VIEWER = 'VIEWER',
}

const master = 
{
    signalingChannel: null,
    peerConnectionByClientId: {},
    dataChannelByClientId: {},
    localStream: null,
    remoteStreams: [],
    peerConnectionStatsInterval: null,
    localView: null,
    remoteView: [],
    signalingClient: null,
};

const viewer = 
{
    SignalingClient: null,
    peerConnection: null,
    localStream: null,
    remoteStream: null
};

const peerConnectionsMap = new Map;


const SignalingChannelARN = 'arn:aws:kinesisvideo:eu-central-1:757329877410:channel/WebRTC-Signaling-Channel/1701691596156';

const accessKeyId = '';
const secretAccessKey = '';

let localView = document.getElementsByTagName('video')[0];
let remoteView = document.getElementsByTagName('video')[1];

const region = 'eu-central-1';
const clientId = 'RANDOM_VALUE';

@Component({
  selector: 'app-kinesis-test',
  templateUrl: './kinesis-test.component.html',
  styleUrls: ['./kinesis-test.component.css']
})

export class KinesisTestComponent 
{
    constructor() {}

    async ngOnInit()
    {
        var videoSelect = document.getElementById("video-select") as HTMLSelectElement;

        var allDevices = await navigator.mediaDevices.enumerateDevices();

        for(let i = 0; i < allDevices.length; i++)
        {
            if(allDevices[i].kind === 'videoinput')
            {
                var option = document.createElement('option');

                option.value = allDevices[i].deviceId;
                option.innerHTML = allDevices[i].deviceId;

                videoSelect.appendChild(option);
            }
        }

        const resolution = 
        {  
            width: 
            { 
                ideal: 1280 
            }, 
            height: 
            { 
                ideal: 720 
            } 
        };


        const constraints = 
        {
            video: resolution,
            audio: true,
        };
        
        //var testingShit = await navigator.mediaDevices.getUserMedia(constraints);
    }
    
    getRandomClientId() 
    {
        return Math.random()
            .toString(36)
            .substring(2)
            .toUpperCase();
    }

    async StartMaster()
    {
        var videoSelect = document.getElementById("video-select") as HTMLSelectElement;

        remoteView = document.getElementsByTagName('video')[1];
        localView = document.getElementsByTagName('video')[0];

        aws.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: 'eu-central-1'
        });

        master.localView = null;

        // Create KVS client
        const kinesisVideoClient = new aws.KinesisVideo({
            endpoint: null,
            correctClockSkew: true,
            region: region,
            
        });

        // Get signaling channel ARN
        const describeSignalingChannelResponse = await kinesisVideoClient.describeSignalingChannel({
            ChannelName: 'WebRTC-Signaling-Channel'
        }).promise();

        const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;
        console.log('[MASTER] Channel ARN: ', channelARN);

        // Get signaling channel endpoints
        const getSignalingChannelEndpointResponse = await kinesisVideoClient.getSignalingChannelEndpoint({
            ChannelARN: channelARN,
            SingleMasterChannelEndpointConfiguration:
            {
                Protocols: ['WSS', 'HTTPS'],
                Role: 'MASTER',
            },
        }).promise();

        const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
            endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            return endpoints;
        }, {});
        console.log('[MASTER] Endpoints: ', endpointsByProtocol);

        console.log('[WSS ENDPOINT] ', endpointsByProtocol['WSS']);

        // Create signaling client
        master.signalingClient = new KVSWebRTC.SignalingClient({
            channelARN: channelARN,
            channelEndpoint: endpointsByProtocol['WSS'],
            role: KVSWebRTC.Role.MASTER,
            region: 'eu-central-1', 
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey
            },
            systemClockOffset: kinesisVideoClient.config.systemClockOffset
        });

        console.log('[HTTPS ENDPOINT] ', endpointsByProtocol['HTTPS']);

        // Get ICE server configuration
        const kinesisVideoSignalingChannelsClient = new aws.KinesisVideoSignalingChannels({
            endpoint: endpointsByProtocol['HTTPS'],
            correctClockSkew: true,
        });

        const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient.getIceServerConfig({
            ChannelARN: channelARN,
        }).promise();

        const iceServers = [];
        iceServers.push({ urls: `stun:stun.kinesisvideo.eu-central-1.amazonaws.com:443` });
        console.log('[MASTER] ICE servers: ', iceServers);



        const resolution = 
        { 
            deviceId:
            {
                exact: videoSelect.value
            },
            // width: 
            // { 
            //     ideal: 1280 
            // }, 
            // height: 
            // { 
            //     ideal: 720 
            // } 
        };

        const constraints = 
        {
            video: resolution,
            audio: true,
        };

        // Get webcam stream and display to local view.
        try
        {
            master.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            //master.localStream = await navigator.mediaDevices.getDisplayMedia();

            console.log(localView)
            console.log(master.localStream);

            localView.srcObject = master.localStream;
        }
        catch(e)
        {
            console.error('[MASTER] Could not detect webcam.');
        }

        master.signalingClient.on('open', async () => {
            console.log('[MASTER] Connected to signaling service');
        });

        master.signalingClient.on("sdpOffer", async (offer, remoteClientId) => {
            console.log('[MASTER] Received SDP offer from client: ' + remoteClientId);

            // Create new peer connection using the offer from the given client.
            peerConnectionsMap.set(remoteClientId, new RTCPeerConnection({
                iceServers: iceServers,
                iceTransportPolicy: 'all'
            }));

            const peerConnection = peerConnectionsMap.get(remoteClientId);

            master.peerConnectionByClientId[remoteClientId] = peerConnection;

            // Send any ICE candidates to the other peer
            peerConnection.addEventListener('icecandidate', ({candidate}) => {
                if(candidate)
                {
                    console.log("[MASTER] Generated ICE candidate for client: " + remoteClientId);

                    master.signalingClient.sendIceCandidate(candidate, remoteClientId);
                }
            });

            peerConnection.addEventListener('track', event => {
                console.log("[MASTER] Received remote track from client: " + remoteClientId);

                remoteView.srcObject = event.streams[0];
            });

            peerConnection.addEventListener('connectionstatechange', event => {
                if(peerConnection.iceConnectionState === 'disconnected')
                {
                    alert("Disconnected.")
                }
            });

            if(master.localStream)
            {
                master.localStream.getTracks().forEach(track => peerConnection.addTrack(track, master.localStream));
            }

            await peerConnection.setRemoteDescription(offer);

            // Create an SDP answer to send back to the client
            console.log('[MASTER] Creating SDP answer for client: ' + remoteClientId);

            await peerConnection.setLocalDescription(
                await peerConnection.createAnswer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                }),
            );

            // When tricke ICE is enabled, send the answer now and then send ICE candidates as they're generated. Otherwise wait on the ICE candidates.
            console.log("[MASTER] Sending SDP answer to client: " + remoteClientId);

            console.log('signaling channel: ', master.signalingChannel);

            master.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId);

            console.log('[MASTER] Generating ICE candidates for client: ' + remoteClientId);
        });

        master.signalingClient.on('iceCandidate', async (candidate, remoteClientId) => {
            console.log('[MASTER] Received ICE candidate from client: ' + remoteClientId);
    
            // Add the ICE candidate received from the client to the peer connection
            const peerConnection = master.peerConnectionByClientId[remoteClientId];
            peerConnection.addIceCandidate(candidate);
        });
    
        master.signalingClient.on('close', () => {
            console.log('[MASTER] Disconnected from signaling channel');
        });
    
        master.signalingClient.on('error', () => {
            console.error('[MASTER] Signaling client error');
        });
    
        console.log('[MASTER] Starting master connection');
        master.signalingClient.open();
    }

    stopMaster() {
        console.log('[MASTER] Stopping master connection');
        if (master.signalingClient) {
            master.signalingClient.close();
            master.signalingClient = null;
        }
    
        Object.keys(master.peerConnectionByClientId).forEach(clientId => {
            master.peerConnectionByClientId[clientId].close();
        });
        master.peerConnectionByClientId = [];
    
        if (master.localStream) {
            master.localStream.getTracks().forEach(track => track.stop());
            master.localStream = null;
        }
    
        master.remoteStreams.forEach(remoteStream => remoteStream.getTracks().forEach(track => track.stop()));
        master.remoteStreams = [];
    
        if (master.peerConnectionStatsInterval) {
            clearInterval(master.peerConnectionStatsInterval);
            master.peerConnectionStatsInterval = null;
        }
    
        if (master.localView) {
            master.localView.srcObject = null;
        }
    
        if (master.remoteView) {
            master.remoteView = [];
        }
    
        if (master.dataChannelByClientId) {
            master.dataChannelByClientId = {};
        }
    }

    async StartViewer()
    {
        aws.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: 'eu-central-1'
        });

        localView = document.getElementsByTagName('video')[0];
        remoteView = document.getElementsByTagName('video')[1];

        // Create KVS client
        const kinesisVideoClient = new aws.KinesisVideo({
            endpoint: null,
            correctClockSkew: true,
            region: region,
        });

        // Get signaling channel ARN
        const describeSignalingChannelResponse = await kinesisVideoClient
        .describeSignalingChannel({
            ChannelName: 'WebRTC-Signaling-Channel',
        })
        .promise();

        const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;
        console.log('[VIEWER] Channel ARN: ', channelARN);

        // Get signaling channel endpoints
        const getSignalingChannelEndpointResponse = await kinesisVideoClient
        .getSignalingChannelEndpoint({
            ChannelARN: channelARN,
            SingleMasterChannelEndpointConfiguration: {
                Protocols: ['WSS', 'HTTPS'],
                Role: KVSWebRTC.Role.VIEWER,
            },
        }).promise();

        const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
            endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            return endpoints;
        }, {});
        console.log('[VIEWER] Endpoints: ', endpointsByProtocol);

        const kinesisVideoSignalingChannelsClient = new aws.KinesisVideoSignalingChannels({
            endpoint: endpointsByProtocol['HTTPS'],
            correctClockSkew: true,
        });

        // Get ICE server configuration
        const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
        .getIceServerConfig({
            ChannelARN: channelARN,
        }).promise();

        const iceServers = [];
        iceServers.push({ urls: `stun:stun.kinesisvideo.eu-central-1.amazonaws.com:443` });
        console.log('[VIEWER] ICE servers: ', iceServers);

        var clientID = this.getRandomClientId();

        // Create Signaling Client
        viewer.SignalingClient = new KVSWebRTC.SignalingClient({
            channelARN,
            channelEndpoint: endpointsByProtocol['WSS'],
            clientId: clientID,
            role: KVSWebRTC.Role.VIEWER,
            region: region,
            credentials: {
                accessKeyId: aws.config.credentials.accessKeyId,
                secretAccessKey: aws.config.credentials.secretAccessKey,
                sessionToken: aws.config.credentials.sessionToken,
            },
            systemClockOffset: kinesisVideoClient.config.systemClockOffset,
        });

        const resolution = { width: { ideal: 1280 }, height: { ideal: 720 } };

        const constraints = {
            video: resolution,
            audio: true,
        };

        viewer.peerConnection = new RTCPeerConnection({
            iceServers: iceServers,
            iceTransportPolicy: 'all'
        });

        viewer.SignalingClient.on('open', async () => {
            console.log('[VIEWER] Connected to signaling service');
    
            try 
            {
                viewer.localStream = await navigator.mediaDevices.getUserMedia(constraints);
                viewer.localStream.getTracks().forEach(track => viewer.peerConnection.addTrack(track, viewer.localStream));

                console.log(localView);

                localView.srcObject = viewer.localStream;
            } 
            catch (e) 
            {
                console.error('[VIEWER] Could not find webcam');
                return;
            }
    
            // Create an SDP offer to send to the master
            console.log('[VIEWER] Creating SDP offer');
            await viewer.peerConnection.setLocalDescription(
                await viewer.peerConnection.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                }),
            );
    
            // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
            console.log('[VIEWER] Sending SDP offer');
            viewer.SignalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
            console.log('[VIEWER] Generating ICE candidates');
        });

        viewer.SignalingClient.on('sdpAnswer', async answer => {
            // Add the SDP answer to the peer connection
            console.log('[VIEWER] Received SDP answer');
            await viewer.peerConnection.setRemoteDescription(answer);
        });
    
        viewer.SignalingClient.on('iceCandidate', candidate => {
            // Add the ICE candidate received from the MASTER to the peer connection
            console.log('[VIEWER] Received ICE candidate');
            viewer.peerConnection.addIceCandidate(candidate);
        });
    
        viewer.SignalingClient.on('close', () => {
            console.log('[VIEWER] Disconnected from signaling channel');
        });
    
        viewer.SignalingClient.on('error', error => {
            console.error('[VIEWER] Signaling client error: ', error);
        });

        // Send any ICE candidates to the other peer
        viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
            if (candidate) 
            {
                console.log('[VIEWER] Generated ICE candidate');

                // When trickle ICE is enabled, send the ICE candidates as they are generated.

                console.log('[VIEWER] Sending ICE candidate');
                viewer.SignalingClient.sendIceCandidate(candidate);
            } 
        });

        // As remote tracks are received, add them to the remote view
        viewer.peerConnection.addEventListener('track', event => {
            console.log('[VIEWER] Received remote track');
            if (remoteView.srcObject) {
                return;
            }
            viewer.remoteStream = event.streams[0];
            remoteView.srcObject = viewer.remoteStream;
        });

        console.log('[VIEWER] Starting viewer connection');
        viewer.SignalingClient.open();
    }   
}
