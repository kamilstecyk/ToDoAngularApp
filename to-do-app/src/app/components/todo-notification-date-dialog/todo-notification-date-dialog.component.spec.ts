import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoNotificationDateDialogComponent } from './todo-notification-date-dialog.component';

describe('TodoNotificationDateDialogComponent', () => {
  let component: TodoNotificationDateDialogComponent;
  let fixture: ComponentFixture<TodoNotificationDateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoNotificationDateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoNotificationDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
