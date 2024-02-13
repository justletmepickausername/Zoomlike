import { Component } from '@angular/core';
import { BackendHandlerService } from '../backend-handler.service';
import { UserData } from '../models';
import { StaticDataService } from '../static-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css']
})
export class SignInPageComponent 
{
	constructor(private backendHandler: BackendHandlerService, private staticData: StaticDataService, private router: Router)
	{

	}

	selectedButton = "Student";

	async SelectButton(button: HTMLButtonElement)
	{
		this.ClearButtonSelection();

		button.classList.add('selected-option-button');

		this.selectedButton = button.innerText;
	}

	async ClearButtonSelection()
	{
		var studentBtn = document.getElementById("studentButton") as HTMLButtonElement;
		var teacherBtn = document.getElementById("teacherButton") as HTMLButtonElement;
		var principalBtn = document.getElementById("principalButton") as HTMLButtonElement;

		studentBtn.classList.remove('selected-option-button');
		teacherBtn.classList.remove('selected-option-button');
		principalBtn.classList.remove('selected-option-button');
	}

    async SignInUser(usernameInput: HTMLInputElement, passwordInput: HTMLInputElement)
    {
		var userData = new UserData();

		userData.Password = passwordInput.value;
		userData.Username = usernameInput.value;
		userData.UserType = this.selectedButton;

        var response = await this.backendHandler.PerformBackendRequest("signin", userData);

		console.log(response);

		this.staticData.SetUserData(userData);
		this.staticData.SetSecretAccessKey(response);

		await this.delay(200);

		if(userData.UserType === "Student")
			this.router.navigate(['/student-dashboard']);

		else if(userData.UserType === "Teacher")
			this.router.navigate(['/teacher-dashboard']);

		else if(userData.UserType === "Principal")
			this.router.navigate(['/principal-dashboard']);

		//location.reload();
    }

	async delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}

	eyeVisible = false;

	mouseClickEye()
	{
		var eyeImage = document.getElementById("eye-image") as HTMLImageElement;
		var passInput = document.getElementById("password-input") as HTMLInputElement;

		if(this.eyeVisible)
		{
			this.eyeVisible = false;

			eyeImage.src = "/assets/eye-slash.svg";

			passInput.type = 'password';
		}
		else
		{
			this.eyeVisible = true;

			eyeImage.src = "/assets/eye.svg";

			passInput.type = 'text';
		}
	}

	mouseEnterEye()
	{
		var eyeImage = document.getElementById("eye-image") as HTMLImageElement;
		var passInput = document.getElementById("password-input") as HTMLInputElement;

		if(!this.eyeVisible)
		{
			eyeImage.src = "/assets/eye.svg";
			passInput.type = 'text';
		}
		else 
		{
			eyeImage.src = "/assets/eye-slash.svg";
			passInput.type = 'password';
		}
	}

	mouseLeaveEye()
	{
		var eyeImage = document.getElementById("eye-image") as HTMLImageElement;
		var passInput = document.getElementById("password-input") as HTMLInputElement;

		if(!this.eyeVisible)
		{
			eyeImage.src = "/assets/eye-slash.svg";
			passInput.type = 'password';
		}
		else 
		{
			eyeImage.src = "/assets/eye.svg";
			passInput.type = 'text';
		}
	}
}
