import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardPageComponent } from './whiteboard-page.component';

describe('WhiteboardPageComponent', () => {
  let component: WhiteboardPageComponent;
  let fixture: ComponentFixture<WhiteboardPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhiteboardPageComponent]
    });
    fixture = TestBed.createComponent(WhiteboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
