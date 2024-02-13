import { Component } from '@angular/core';
import { UserData } from '../models';
import { BackendHandlerService } from '../backend-handler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal-dashboard-page',
  templateUrl: './principal-dashboard-page.component.html',
  styleUrls: ['./principal-dashboard-page.component.css']
})
export class PrincipalDashboardPageComponent 
{
	constructor(private backendHandler: BackendHandlerService, private router: Router)
	{

	}

	teacherAccounts: any;

	async ngOnInit()
	{
		this.teacherAccounts = await this.backendHandler.PerformBackendRequest("getteacheraccounts");
	}

  	async CreateTeacherAccount(teacherUsernameInput: HTMLInputElement, teacherPasswordInput: HTMLInputElement, teacherEmailInput: HTMLInputElement)
	{
		var userData = new UserData();

		userData.Username = teacherUsernameInput.value;
		userData.Password = teacherPasswordInput.value;
		userData.UserType = "Teacher";
		userData.Email = teacherEmailInput.value;

		await this.backendHandler.PerformBackendRequest("signup", userData);

		location.reload();
		//alert("Successfully created teacher account: " + teacherUsernameInput.value);
	}

	async DeleteTeacherAccount(i: number)
	{
		var userData = new UserData();

		userData.Username = this.teacherAccounts[i].username;
		
		await this.backendHandler.PerformBackendRequest("deleteaccount", userData);

		location.reload();
	}

	async ResetTeacherPassword(i: number)
	{
		var userData = new UserData();

		userData.Username = this.teacherAccounts[i].username;
		
		await this.backendHandler.PerformBackendRequest("resetteacherpassword", userData);

		location.reload();
	}
}
