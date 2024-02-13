import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCreatePageComponent } from './class-create-page.component';

describe('ClassCreatePageComponent', () => {
  let component: ClassCreatePageComponent;
  let fixture: ComponentFixture<ClassCreatePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassCreatePageComponent]
    });
    fixture = TestBed.createComponent(ClassCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
