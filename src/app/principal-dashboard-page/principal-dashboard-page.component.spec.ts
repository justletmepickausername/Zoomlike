import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalDashboardPageComponent } from './principal-dashboard-page.component';

describe('PrincipalDashboardPageComponent', () => {
  let component: PrincipalDashboardPageComponent;
  let fixture: ComponentFixture<PrincipalDashboardPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrincipalDashboardPageComponent]
    });
    fixture = TestBed.createComponent(PrincipalDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
