import { Component } from '@angular/core';
import { ClassData } from '../models';
import { BackendHandlerService } from '../backend-handler.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-class-create-page',
  templateUrl: './class-create-page.component.html',
  styleUrls: ['./class-create-page.component.css']
})
export class ClassCreatePageComponent 
{
	constructor(private backendHandler: BackendHandlerService, private _location: Location)
	{}

	microphoneState: any;
	cameraState: any;
	backgroundState: any;

	studentAccounts: any;
	teacherAccounts: any;

	selectedTeacher: any;

	microphoneStates = [ 'Unmuted', 'Muted']; // unmuted = microphone enabled. muted = microhpone disabled.
	microphoneImages = [ '/assets/microphone-lines-solid.svg', '/assets/microphone-lines-slash-solid.svg'];
	videoStates = [ 'On', 'Off']; // on = video enabled. off = video disabled.
	videoImages = [ '/assets/video-solid.svg', '/assets/video-slash-solid.svg' ];
	backgroundStates = [ 'Squares' ]; 
	backgroundImages = [ '/assets/grid-1.svg' ];

	async ngOnInit()
	{
		this.studentAccounts = await this.backendHandler.PerformBackendRequest("getstudentaccounts");
		this.teacherAccounts = await this.backendHandler.PerformBackendRequest("getteacheraccounts");

		this.microphoneState = -1;
		this.cameraState = -1;
		this.backgroundState = -1;

		this.CycleMicrophoneState();
		this.CycleVideoState();
		this.CycleBackgroundState();
	}

	async CreateClass()
	{
		var classNameInput = document.getElementById("classCreationClassNameInput") as HTMLInputElement; 
		var classDay = document.getElementById("classCreationClassDaySelect") as HTMLElement; 
		var classStartHour = document.getElementById("classCreationStartingHourInput") as HTMLInputElement; 
		var classEndHour = document.getElementById("classCreationEndingHourInput") as HTMLInputElement; 
		var classStudents = document.getElementById("classCreationStudentsSelect") as HTMLSelectElement; 
		var classTeacher = document.getElementById("classCreationTeacherSelect") as HTMLSelectElement; 
		var classWhiteboardState = document.getElementById("classCreationWhiteboardBackgroundSelect") as HTMLSelectElement;

		var classData = new ClassData();

		classData.ClassName = classNameInput.value;
		classData.DayOfTheWeek = classDay.innerText;
		classData.StartHour = classStartHour.value;
		classData.EndHour = classEndHour.value;
		classData.Students = classStudents.innerText.split(', ');
		classData.Teacher = classTeacher.innerText;
		classData.DefaultWhiteboard = this.backgroundStates[this.backgroundState];
		classData.DefaultMicrophoneState = this.microphoneStates[this.microphoneState];
		classData.DefaultCameraState = this.videoStates[this.cameraState];

		var response = await this.backendHandler.PerformBackendRequest("createclass", classData);
	}

	ExitClassCreationPage()
	{
		this._location.back();
	}

	async CycleMicrophoneState()
	{
		this.microphoneState++;

		if(this.microphoneState >= this.microphoneStates.length)
			this.microphoneState = 0;

		var mic = document.getElementById('microphoneImage') as HTMLImageElement;

		if(this.microphoneState === 0)
		{
			mic.classList.remove('muted-mic');
			mic.classList.add("unmuted-mic");
		}
		else
		{
			mic.classList.remove("unmuted-mic");
			mic.classList.add('muted-mic');
		}

		mic.src = this.microphoneImages[this.microphoneState];

		//alert("Cycled mic state to " + this.microphoneState + " and image to " + this.microphoneImages[this.microphoneState]);
	}

	async CycleVideoState()
	{
		this.cameraState++;

		if(this.cameraState >= this.videoStates.length)
			this.cameraState = 0;

		var cam = document.getElementById('videoImage') as HTMLImageElement;

		if(this.cameraState === 0)
		{
			cam.classList.remove('no-cam');
			cam.classList.add("with-cam");
		}
		else
		{
			cam.classList.remove("with-cam");
			cam.classList.add('no-cam');
		}

		cam.src = this.videoImages[this.cameraState];
	}

	async CycleBackgroundState()
	{
		this.backgroundState++;

		if(this.backgroundState >= this.backgroundStates.length)
			this.backgroundState = 0;

		var background = document.getElementById('backgroundImage') as HTMLImageElement;

		if(this.backgroundState === 0)
		{
			//background.classList.remove('no-cam');
			//background.classList.add("with-cam");
		}
		else
		{
			//background.classList.remove("with-cam");
			//background.classList.add('no-cam');
		}

		background.src = this.backgroundImages[this.backgroundState];
	}
}
