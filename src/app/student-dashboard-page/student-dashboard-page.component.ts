import { Component } from '@angular/core';
import { ClassData, UserData } from '../models';
import { BackendHandlerService } from '../backend-handler.service';
import { StaticDataService } from '../static-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard-page',
  templateUrl: './student-dashboard-page.component.html',
  styleUrls: ['./student-dashboard-page.component.css']
})
export class StudentDashboardPageComponent 
{
	constructor(private backendHandler: BackendHandlerService, private router: Router, private staticData: StaticDataService)
	{

	}

	studentAccounts: any;
	teacherAccounts: any;

	selectedTeacher: any;

	selectedDayOfTheWeek: any;
	microphoneState: any;
	cameraState: any;

	studentCount: any;
	classCount: any;

	teacherClasses: any;
	teacherData: any;

	async ngOnInit()
	{
		this.studentAccounts = await this.backendHandler.PerformBackendRequest("getstudentaccounts");
		this.teacherAccounts = await this.backendHandler.PerformBackendRequest("getteacheraccounts");

		this.studentCount = this.studentAccounts.length;

		var userData = this.staticData.GetUserData();

		console.log(userData);

		this.teacherData = JSON.parse(userData);

		this.teacherClasses = await this.backendHandler.PerformBackendRequest("getteacherclasses", userData);

		this.classCount = this.teacherClasses.length;
	}

  	async CreateStudentAccount(studentUsernameInput: HTMLInputElement, studentPasswordInput: HTMLInputElement, studentEmailInput: HTMLInputElement)
	{
		var userData = new UserData();

		userData.Username = studentUsernameInput.value;
		userData.Password = studentPasswordInput.value;
		userData.UserType = "Student";
		userData.Email = studentEmailInput.value;

		await this.backendHandler.PerformBackendRequest("signup", userData);

		location.reload();
		//alert("Successfully created student account: " + studentUsernameInput.value);
	}

	async DeleteStudentAccount(i: number)
	{
		var userData = new UserData();

		userData.Username = this.studentAccounts[i].username;
		
		await this.backendHandler.PerformBackendRequest("deleteaccount", userData);

		location.reload();
	}

	async ResetStudentPassword(i: number)
	{
		var userData = new UserData();

		userData.Username = this.studentAccounts[i].username;
		
		await this.backendHandler.PerformBackendRequest("resetteacherpassword", userData);

		location.reload();
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
		classData.DefaultWhiteboard = classWhiteboardState.innerText;
		classData.DefaultMicrophoneState = this.microphoneState;
		classData.DefaultCameraState = this.cameraState;

		var response = await this.backendHandler.PerformBackendRequest("createclass", classData);
	}

	onMicrophoneButtonToggleChange(event)
	{
		this.microphoneState = event.value;
	}

	onCameraButtonToggleChange(event)
	{
		this.cameraState = event.value;
	}
}
