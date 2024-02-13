import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDashboardPageFinalComponent } from './teacher-dashboard-page-final.component';

describe('TeacherDashboardPageFinalComponent', () => {
  let component: TeacherDashboardPageFinalComponent;
  let fixture: ComponentFixture<TeacherDashboardPageFinalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherDashboardPageFinalComponent]
    });
    fixture = TestBed.createComponent(TeacherDashboardPageFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
