import { Component } from '@angular/core';
import { BackendHandlerService } from '../backend-handler.service';
import { UserData } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent 
{
    constructor(private backendHandler: BackendHandlerService, private router: Router)
    {

    }

    async SignUpUser(usernameInput: HTMLInputElement, emailInput: HTMLInputElement, confirmEmailInput: HTMLInputElement, passwordInput: HTMLInputElement, userTypeSelect: HTMLSelectElement)
    {
		var userData = new UserData();

		userData.Password = passwordInput.value;
		userData.Username = usernameInput.value;
		userData.Email = emailInput.value;
		userData.UserType = userTypeSelect.value;

        await this.backendHandler.PerformBackendRequest("signup", userData);

		this.router.navigate(['/signin']);
    }

}
