import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { BackendHandlerService } from '../backend-handler.service';
import { UserData } from '../models';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css']
})
export class CreateStudentComponent 
{
	constructor(private backendHandler: BackendHandlerService, private _location: Location)
	{}

	async CreateStudent()
	{
		var studentName = document.getElementById('studentName') as HTMLInputElement;
		var studentEmail = document.getElementById('studentEmail') as HTMLInputElement;
		var studentPass1 = document.getElementById('studentPass1') as HTMLInputElement;
		var studentPass2 = document.getElementById('studentPass2') as HTMLInputElement;
		var parentName = document.getElementById('parentName') as HTMLInputElement;
		var parentNumber = document.getElementById('parentNumber') as HTMLInputElement;

		var userData = new UserData();
		
		userData.Username = studentName.value;
		userData.Email = studentEmail.value;
		userData.Password = studentPass1.value;
		userData.UserType = "Student";
		userData.fullName = studentName.value;
		userData.parentName = parentName.value;
		userData.parentNumber = parentNumber.value;

		await this.backendHandler.PerformBackendRequest("signup", userData);

		location.reload();
	}

	ExitPage()
	{
		this._location.back();
	}
}
