import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KinesisTestComponent } from './kinesis-test/kinesis-test.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { TeacherDashboardPageComponent } from './teacher-dashboard-page/teacher-dashboard-page.component';
import { PrincipalDashboardPageComponent } from './principal-dashboard-page/principal-dashboard-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { WhiteboardPageComponent } from './whiteboard-page/whiteboard-page.component';
import { ClassCreatePageComponent } from './class-create-page/class-create-page.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { StudentDashboardPageComponent } from './student-dashboard-page/student-dashboard-page.component';
import { CreateStudentComponent } from './create-student/create-student.component';
import { TeacherDashboardPageFinalComponent } from './teacher-dashboard-page-final/teacher-dashboard-page-final.component';

const routes: Routes = [
    { path: '', component: SignInPageComponent },
    { path: 'signup', component: SignUpPageComponent },
    { path: 'signin', component: SignInPageComponent },
    { path: 'teacher-dashboard', component: TeacherDashboardPageFinalComponent },
    { path: 'principal-dashboard', component: PrincipalDashboardPageComponent },
    { path: 'schedule', component: SchedulePageComponent },
    { path: 'whiteboard', component: WhiteboardComponent },
    { path: 'class-create', component: ClassCreatePageComponent },
    { path: 'student-dashboard', component: StudentDashboardPageComponent },
    { path: 'create-student', component: CreateStudentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
