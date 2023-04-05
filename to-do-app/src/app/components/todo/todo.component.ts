import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { Component, OnInit } from '@angular/core'
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { KindOfTodos } from 'src/app/model/KindOfTodos'
import { TodosService } from 'src/app/services/todos.service'
import { AuthService } from 'src/app/shared/services/auth.service'
import { TodoNotificationDateDialogComponent } from '../todo-notification-date-dialog/todo-notification-date-dialog.component'
import { NotificationsService } from 'src/app/services/notifications.service'

declare let alertify: any

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  KindOfTodos = KindOfTodos
  todoForm !: FormGroup
  updateId !: any
  isEditEnabled: boolean = false

  userTodos : string[] = []
  userInProgressTodos : string[] = []
  userDoneTodos : string[] = []
  userEmail!: string 
  userNotFouund = false

  constructor(private fb : FormBuilder, private todoService : TodosService, private authService: AuthService, public dialog: MatDialog, private notificationsService: NotificationsService){}

  ngOnInit(): void {
      this.userEmail = this.authService.loggedInUserEmail()

      this.todoForm = this.fb.group(
        {
          item : ['', Validators.required]
        }
      )

      this.fetchAllUserTodos()
  }

  // TODO change email 
  fetchAllUserTodos(){
    this.todoService.getUserTodos(this.userEmail).subscribe(
    (data) => {
      console.log("Loaded all user Todos")
      this.userTodos = data.todos
      this.userInProgressTodos = data.inProgress
      this.userDoneTodos = data.done
      this.userNotFouund = false
    },
    error => {
      console.log("User does not have Todos.. Cannot load")
      console.log(error.message)
      this.userNotFouund = true
    })
  }

  onEdit(item: string, i:number){
    this.todoForm.controls['item'].setValue(item)
    this.updateId = i
    this.isEditEnabled = true
  }

  addTask(){
    this.userTodos.push(
      this.todoForm.value.item
    )

    // we update existing record
    if(!this.userNotFouund){
      this.todoService.updateUserRecord(this.userEmail, { "todos" : this.userTodos }).subscribe((data) => {
        console.log("Added user todo with updated user record")
        alertify.success('Todo has been added!');
      })
    }
    else{
      this.todoService.addUserRecord({id : this.userEmail,
        todos : [],
        inProgress : [],
        done : []}).subscribe((data) => {
          console.log("Added new user record")
          alertify.success('Todo has been added!');
        })
        this.userNotFouund = false
    }

    this.todoForm.reset()
  }

  updateTask(){
    this.userTodos[this.updateId] = this.todoForm.value.item
    this.todoService.updateUserRecord(this.userEmail, { "todos" : this.userTodos }).subscribe((data) => {
      console.log("Updated user todos record with updated values")
      alertify.success('Todo has been updated!');
    })

    this.todoForm.reset()
    this.updateId = undefined
    this.isEditEnabled = false
  }

  displayDeleteDialog(index: number,  kindOfTodo: KindOfTodos){

    const deleteTodo = (index: number,kindOfTodo: KindOfTodos) => {
      this.deleteTask(index, kindOfTodo)
    }

    alertify.confirm("Are you sure that you want to delete this todo?",
      function(){
        deleteTodo(index,kindOfTodo)
      },
      function(){
        alertify.error('Deleting todo has been canceled!');
    });
  }

  deleteTask(index: number, kindOfTodo: KindOfTodos){
    switch (kindOfTodo)
    {
      case KindOfTodos.ToDo:
        this.userTodos.splice(index,1)
        break
      case KindOfTodos.InProgress:
        this.userInProgressTodos.splice(index,1)
        break
      case KindOfTodos.Done:
        this.userDoneTodos.splice(index,1)
        break
    }

    this.todoService.updateUserRecord(this.userEmail, { "todos" : this.userTodos , "inProgress" : this.userInProgressTodos, "done" : this.userDoneTodos}).subscribe((data) => {
      console.log("Updated user all todos")
      alertify.success('Todo has been removed!');
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      )
    }

    this.todoService.updateUserRecord(this.userEmail, { "todos" : this.userTodos , "inProgress" : this.userInProgressTodos, "done" : this.userDoneTodos}).subscribe((data) => {
      console.log("Updated user all todos")
    })
  }

  openDateDialog(todo: string){
    const dialogRef = this.dialog.open(TodoNotificationDateDialogComponent, {
      data: todo,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(result != undefined){
        const notificationTimestamp = Date.parse(result)
        const messageToSend = "do " + todo + " now!"
        this.notificationsService.addNotification(this.userEmail, messageToSend, notificationTimestamp)
      }
    })
  }
}
