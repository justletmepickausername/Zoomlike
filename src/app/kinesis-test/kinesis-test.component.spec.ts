import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinesisTestComponent } from './kinesis-test.component';

describe('KinesisTestComponent', () => {
  let component: KinesisTestComponent;
  let fixture: ComponentFixture<KinesisTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KinesisTestComponent]
    });
    fixture = TestBed.createComponent(KinesisTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
