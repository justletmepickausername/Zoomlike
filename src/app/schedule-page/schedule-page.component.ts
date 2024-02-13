import { Component } from '@angular/core';
import { BackendHandlerService } from '../backend-handler.service';
import { ClassData, UserData } from '../models';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css']
})
export class SchedulePageComponent 
{
	constructor(private backendHandler: BackendHandlerService)
	{

	}

    studentClasses: any[];
	JSONData: any;

	sundayClasses: any[];
	mondayClasses: any[];
	tuesdayClasses: any[];
	wednesdayClasses: any[];
	thursdayClasses: any[];
	fridayClasses: any[];

	someVariable = 1;

	async ngOnInit()
	{
		this.sundayClasses = [];
		this.sundayClasses.push({});
		this.sundayClasses.push({});
		this.sundayClasses.push({});
		this.sundayClasses.push({});
		this.sundayClasses.push({});
		this.sundayClasses.push({});
		this.sundayClasses.push({});
		this.sundayClasses.push({});
		this.sundayClasses.push({});

		this.mondayClasses = [];
		this.mondayClasses.push({});
		this.mondayClasses.push({});
		this.mondayClasses.push({});
		this.mondayClasses.push({});
		this.mondayClasses.push({});
		this.mondayClasses.push({});
		this.mondayClasses.push({});
		this.mondayClasses.push({});
		this.mondayClasses.push({});

		this.tuesdayClasses = [];
		this.tuesdayClasses.push({});
		this.tuesdayClasses.push({});
		this.tuesdayClasses.push({});
		this.tuesdayClasses.push({});
		this.tuesdayClasses.push({});
		this.tuesdayClasses.push({});
		this.tuesdayClasses.push({});
		this.tuesdayClasses.push({});
		this.tuesdayClasses.push({});

		this.wednesdayClasses = [];
		this.wednesdayClasses.push({});
		this.wednesdayClasses.push({});
		this.wednesdayClasses.push({});
		this.wednesdayClasses.push({});
		this.wednesdayClasses.push({});
		this.wednesdayClasses.push({});
		this.wednesdayClasses.push({});
		this.wednesdayClasses.push({});
		this.wednesdayClasses.push({});

		this.thursdayClasses = [];
		this.thursdayClasses.push({});
		this.thursdayClasses.push({});
		this.thursdayClasses.push({});
		this.thursdayClasses.push({});
		this.thursdayClasses.push({});
		this.thursdayClasses.push({});
		this.thursdayClasses.push({});
		this.thursdayClasses.push({});
		this.thursdayClasses.push({});

		this.fridayClasses = [];
		this.fridayClasses.push({});
		this.fridayClasses.push({});
		this.fridayClasses.push({});
		this.fridayClasses.push({});
		this.fridayClasses.push({});
		this.fridayClasses.push({});
		this.fridayClasses.push({});
		this.fridayClasses.push({});
		this.fridayClasses.push({});

		var userData = new UserData();

		userData.Username = "StudentTest";

		this.studentClasses = await this.backendHandler.PerformBackendRequest("getstudentclasses", userData);

		console.log(this.studentClasses);

		for(var i = 0; i < this.studentClasses.length; i++)
		{
			if(this.studentClasses[i].dayOfTheWeek === "Sunday")
			{
				if(this.studentClasses[i].startHour.includes("8:"))
					this.sundayClasses[0] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "9:00 AM")
					this.sundayClasses[1] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "10:00 AM")
					this.sundayClasses[2] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "11:00 AM")
					this.sundayClasses[3] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "12:00 PM")
					this.sundayClasses[4] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "1:00 PM")
					this.sundayClasses[5] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "2:00 PM")
					this.sundayClasses[6] = this.studentClasses[i];
			}
			else if(this.studentClasses[i].dayOfTheWeek === "Monday")
			{
				if(this.studentClasses[i].startHour === "8:00 AM")
					this.mondayClasses[0] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "9:00 AM")
					this.mondayClasses[1] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "10:00 AM")
					this.mondayClasses[2] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "11:00 AM")
					this.mondayClasses[3] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "12:00 PM")
					this.mondayClasses[4] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "1:00 PM")
					this.mondayClasses[5] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "2:00 PM")
					this.mondayClasses[6] = this.studentClasses[i];
			}
			else if(this.studentClasses[i].dayOfTheWeek === "Tuesday")
			{
				if(this.studentClasses[i].startHour === "8:00 AM")
					this.tuesdayClasses[0] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "9:00 AM")
					this.tuesdayClasses[1] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "10:00 AM")
					this.tuesdayClasses[2] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "11:00 AM")
					this.tuesdayClasses[3] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "12:00 PM")
					this.tuesdayClasses[4] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "1:00 PM")
					this.tuesdayClasses[5] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "2:00 PM")
					this.tuesdayClasses[6] = this.studentClasses[i];
			}
			else if(this.studentClasses[i].dayOfTheWeek === "Wednesday")
			{
				if(this.studentClasses[i].startHour === "8:00 AM")
					this.wednesdayClasses[0] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "9:00 AM")
					this.wednesdayClasses[1] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "10:00 AM")
					this.wednesdayClasses[2] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "11:00 AM")
					this.wednesdayClasses[3] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "12:00 PM")
					this.wednesdayClasses[4] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "1:00 PM")
					this.wednesdayClasses[5] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "2:00 PM")
					this.wednesdayClasses[6] = this.studentClasses[i];
			}
			else if(this.studentClasses[i].dayOfTheWeek === "Thursday")
			{
				if(this.studentClasses[i].startHour === "8:00 AM")
					this.thursdayClasses[0] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "9:00 AM")
					this.thursdayClasses[1] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "10:00 AM")
					this.thursdayClasses[2] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "11:00 AM")
					this.thursdayClasses[3] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "12:00 PM")
					this.thursdayClasses[4] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "1:00 PM")
					this.thursdayClasses[5] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "2:00 PM")
					this.thursdayClasses[6] = this.studentClasses[i];
			}
			else if(this.studentClasses[i].dayOfTheWeek === "Friday")
			{
				if(this.studentClasses[i].startHour === "8:00 AM" || this.studentClasses[i].startHour.includes("8:"))
					this.fridayClasses[0] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "9:00 AM")
					this.fridayClasses[1] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "10:00 AM")
					this.fridayClasses[2] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "11:00 AM")
					this.fridayClasses[3] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "12:00 PM")
					this.fridayClasses[4] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "1:00 PM")
					this.fridayClasses[5] = this.studentClasses[i];

				else if(this.studentClasses[i].startHour === "2:00 PM")
					this.fridayClasses[6] = this.studentClasses[i];
			}
		}
	}
}
