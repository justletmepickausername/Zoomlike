import { Injectable } from '@angular/core';
import { UserData } from './models';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService 
{
  	constructor() { }

	SecretAccessKey: any = null;
	UserData: any = null;

	SetSecretAccessKey(secretAccessKey: any)
	{
		localStorage.setItem("UserAccessKey" ,secretAccessKey);

		this.SecretAccessKey = secretAccessKey;
	}

	GetSecretAccessKey()
	{
		if(this.SecretAccessKey === null)
		{
			this.SecretAccessKey = localStorage.getItem("UserAccessKey");
		}

		return this.SecretAccessKey;
	}

	GetUserData()
	{
		this.UserData = localStorage.getItem("userData");

		return this.UserData;
	}

	SetUserData(userData: UserData)
	{
		localStorage.setItem("userData", JSON.stringify(userData));

		this.UserData = userData;
	}
}
