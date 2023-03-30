import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { Component, OnInit } from '@angular/core'
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import { ITask } from 'src/app/model/ITask'
import { KindOfTodos } from 'src/app/model/KindOfTodos'

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  KindOfTodos = KindOfTodos
  todoForm !: FormGroup
  tasks: ITask[] = []
  inProgress: ITask[] = []
  done: ITask[] = []
  updateId !: any
  isEditEnabled: boolean = false

  constructor(private fb : FormBuilder){}

  ngOnInit(): void {
      this.todoForm = this.fb.group(
        {
          item : ['', Validators.required]
        }
      )
  }

  onEdit(item: ITask, i:number){
    this.todoForm.controls['item'].setValue(item.description)
    this.updateId = i
    this.isEditEnabled = true
  }

  addTask(){
    this.tasks.push({
      description: this.todoForm.value.item,
      done: false
    })
    this.todoForm.reset()
  }

  updateTask(){
    this.tasks[this.updateId].description = this.todoForm.value.item
    this.tasks[this.updateId].done = false
    this.todoForm.reset()
    this.updateId = undefined
    this.isEditEnabled = false
  }

  deleteTask(index: number, kindOfTodo: KindOfTodos){
    switch (kindOfTodo)
    {
      case KindOfTodos.ToDo:
        this.tasks.splice(index,1)
        break
      case KindOfTodos.InProgress:
        this.inProgress.splice(index,1)
        break
      case KindOfTodos.Done:
        this.done.splice(index,1)
        break
    }
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      )
      // Here we have index of list which we drag to 
      console.log(event)
      let idOfTargetedList = Number(event.container.id.split('-')[3])
      console.log("Target list: ", idOfTargetedList)
    }
  }
}
