import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { toDo, TodoServiceService } from '../services/todo-service.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {
  @Input()
  item!: toDo;

  @Input() tab: string;

  @Output() remove = new EventEmitter();
  @Output() restore = new EventEmitter();
  @Output() removeFrvr = new EventEmitter();

  @ViewChild('myCheck') myCheck:any;
  constructor(private service:TodoServiceService) {
    this.tab = '';
  }

  ngOnInit(): void {
  }

  completeTodo(item: toDo) {
    item.completed = !item.completed;
    if(item.id) {
      this.service.updateTodo(item.id,{completed:item.completed});
    }  
  }

  removeTodo(item: toDo) {
    this.remove.emit(item);
  }

  restoreTodo(item: toDo) {
    this.restore.emit(item);
  }

  removeForever(item: toDo) {
    this.removeFrvr.emit(item);
  }

}
