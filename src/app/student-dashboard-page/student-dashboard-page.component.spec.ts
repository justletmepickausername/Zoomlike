import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDashboardPageComponent } from './student-dashboard-page.component';

describe('StudentDashboardPageComponent', () => {
  let component: StudentDashboardPageComponent;
  let fixture: ComponentFixture<StudentDashboardPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDashboardPageComponent]
    });
    fixture = TestBed.createComponent(StudentDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
