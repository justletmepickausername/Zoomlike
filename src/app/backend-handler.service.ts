import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EMPTY, catchError, map } from 'rxjs';
import { Router } from '@angular/router';
import { StaticDataService } from './static-data.service';

@Injectable({
  providedIn: 'root'
})
export class BackendHandlerService 
{
	constructor(private http: HttpClient, private router: Router, private staticData: StaticDataService) 
	{
		
	}

	baseUrl = "http://localhost:32769/";

	async PerformBackendRequest(endpoint, data = null) : Promise<any>
	{
        var accessToken =  this.staticData.GetSecretAccessKey();

		const url = this.baseUrl + endpoint;

        const requestData = data;
        
        const httpOptions = {

            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }),

        };

        return new Promise((resolve, reject) => {
            this.http.post(url, requestData, httpOptions).pipe(
                map((response: any) => {
                    //alert(response);
                    resolve(response); // Resolve the promise with the response
                }),
                catchError((error: any) => {

                    if(error.status === 401)
                    {
                        this.router.navigate(['/signin']);
                    }
                    
                    reject(error); // Reject the promise with the error
                    throw error;
                })
            ).subscribe({
                error: (e) => {
                    resolve(null); // Resolve with null in case of an error
                },
                complete: () => {
                }
            });
        });
	}
}
