import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestingPageComponent } from './testing-page/testing-page.component';
import { KinesisTestComponent } from './kinesis-test/kinesis-test.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { TeacherDashboardPageComponent } from './teacher-dashboard-page/teacher-dashboard-page.component';
import { PrincipalDashboardPageComponent } from './principal-dashboard-page/principal-dashboard-page.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { WhiteboardPageComponent } from './whiteboard-page/whiteboard-page.component';
import {MatSliderModule} from '@angular/material/slider';
import { ClassCreatePageComponent } from './class-create-page/class-create-page.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudentDashboardPageComponent } from './student-dashboard-page/student-dashboard-page.component';
import { CreateStudentComponent } from './create-student/create-student.component';
import { TeacherDashboardPageFinalComponent } from './teacher-dashboard-page-final/teacher-dashboard-page-final.component';

@NgModule({
  declarations: [
    AppComponent,
    TestingPageComponent,
    KinesisTestComponent,
    NavbarComponent,
    SignUpPageComponent,
    SignInPageComponent,
    TeacherDashboardPageComponent,
    PrincipalDashboardPageComponent,
    SchedulePageComponent,
    WhiteboardPageComponent,
    ClassCreatePageComponent,
    WhiteboardComponent,
    ScheduleComponent,
    StudentDashboardPageComponent,
    CreateStudentComponent,
    TeacherDashboardPageFinalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    NgxMaterialTimepickerModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
