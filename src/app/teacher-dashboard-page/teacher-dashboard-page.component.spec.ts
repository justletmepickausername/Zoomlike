import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDashboardPageComponent } from './teacher-dashboard-page.component';

describe('TeacherDashboardPageComponent', () => {
  let component: TeacherDashboardPageComponent;
  let fixture: ComponentFixture<TeacherDashboardPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherDashboardPageComponent]
    });
    fixture = TestBed.createComponent(TeacherDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
