import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-todo-notification-date-dialog',
  templateUrl: './todo-notification-date-dialog.component.html',
  styleUrls: ['./todo-notification-date-dialog.component.scss']
})
export class TodoNotificationDateDialogComponent {
  minDate: Date = new Date()
  chosenDate: any 
  defaultTime: [number, number, number] = [this.minDate.getDate(), this.minDate.getMinutes() + 5, this.minDate.getSeconds()]

  constructor(
    public dialogRef: MatDialogRef<TodoNotificationDateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {}

  onCloseClick(): void {
    this.dialogRef.close()
  }
}
