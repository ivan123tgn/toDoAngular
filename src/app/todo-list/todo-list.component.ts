import {ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { toDo, TodoServiceService } from '../services/todo-service.service';
import {firebase} from "firebaseui-angular";
import { AngularFireAuth } from '@angular/fire/auth';
import {userData} from "../services/todo-service.service";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: toDo[] = [];
  listedTodos: toDo[] = [];
  removedTodos: toDo[] = [];
  mainInput:any;
  numActive:number=0;
  numCompleted:number=0;
  tab:string ='total';
  userData:userData = {
    id: 'anonymous',
    email: 'unknown',
    activeTodos: [],
    completedTodos: [],
    removedTodos: []
  };

  constructor(public service:TodoServiceService, public auth:AngularFireAuth, private ref: ChangeDetectorRef) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.service.getUserData(user.uid)
          .then(res => {
           this.userData = <userData>res.data();
           this.todos = [...this.userData.activeTodos, ...this.userData.completedTodos];
           console.log(this.userData)
           console.log(this.todos);
           this.ref.detectChanges();
          })
          .catch(err => console.log(err));
      } else {
        this.userData = {
          id: 'anonymous',
          email: 'unknown',
          activeTodos: [],
          completedTodos: [],
          removedTodos: []
        };
      }
    });
  }

  ngOnInit() {}

  addSymbol(event:any) {
    if(event.keyCode === 13) {
      const todoData = {
        value: this.mainInput,
        completed: false,
        deleted: false,
        id: Date.now().toString(),
      };
      this.userData.activeTodos.push(todoData);
      this.service.updateUserData(this.userData);
      this.mainInput = '';
    }
    this.todos = this.userData.activeTodos;
  }

  removeTodo(item: toDo) {
    item.deleted = true;
    if (item.completed) {
      this.userData.completedTodos = this.userData.completedTodos.filter(todo => todo.id !== item.id);
      this.userData.removedTodos.push(item);
    } else {
      this.userData.activeTodos = this.userData.activeTodos.filter(todo => todo.id !== item.id);
      this.userData.removedTodos.push(item);
    }
    this.todos = this.todos.filter(todo => todo.id !== item.id);
    this.service.updateUserData(this.userData);
    this.ref.detectChanges();
  }

  showRemoved(event:any) {
    this.todos = this.userData.removedTodos;
    this.tab = 'removed';
  }

  showActive(event:any) {
    this.todos = this.userData.activeTodos;
    this.tab = 'active';
  }

  showTotal(event:any) {
    this.todos = [...this.userData.activeTodos, ...this.userData.completedTodos];
    this.tab = 'total';
  }

  showCompleted(event:any) {
    this.todos = this.userData.completedTodos;
    this.tab = 'completed';
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
  }

  removeForever(item:toDo){
    this.userData.removedTodos = this.userData.removedTodos.filter(todo => todo.id !== item.id);
    this.service.updateUserData(this.userData);
    this.todos = this.userData.removedTodos;
    this.tab = 'removed';
    this.ref.detectChanges();
    this.service.toastr.warning('Your todo is removed forever!');
  }

  restoreTodo(item:toDo) {
    item.deleted = false;
    this.userData.removedTodos = this.userData.removedTodos.filter(todo => todo.id !== item.id);
    this.todos = this.userData.removedTodos;
    if (item.completed) {
      this.userData.completedTodos.push(item);
    } else {
      this.userData.activeTodos.push(item);
    }
    this.service.updateUserData(this.userData);
    this.ref.detectChanges();
    this.service.toastr.success('Your todo is restored!');
  }

  completeTodo(item:toDo) {
    if (item.deleted) {
      item.completed = !item.completed;
    } else {
      if (item.completed) {
        item.completed = false;
        this.userData.completedTodos = this.userData.completedTodos.filter(todo => todo.id !== item.id);
        this.userData.activeTodos.push(item);
      } else {
        item.completed = true;
        this.userData.activeTodos = this.userData.activeTodos.filter(todo => todo.id !== item.id);
        this.userData.completedTodos.push(item);
      }
    }
    this.service.updateUserData(this.userData);
    this.ref.detectChanges();
  }

  restoreAll(event:any) {
    this.userData.removedTodos.forEach(el => el.deleted = false);
    const restoreActive = this.userData.removedTodos.filter(todo => !todo.completed);
    const restoreCompleted = this.userData.removedTodos.filter(todo => todo.completed);
    this.userData.removedTodos = [];
    this.userData.activeTodos = [...this.userData.activeTodos, ...restoreActive];
    this.userData.completedTodos = [...this.userData.completedTodos, ...restoreCompleted];
    this.todos = [];
    this.service.updateUserData(this.userData);
    this.ref.detectChanges();
    this.service.toastr.success('All removed todos are restored!');
  }

  removeCompleted(event:any) {
    this.userData.completedTodos.forEach(el => el.deleted = true);
    this.userData.removedTodos = [...this.userData.removedTodos, ...this.userData.completedTodos];
    this.userData.completedTodos = [];
    this.service.updateUserData(this.userData);
    this.tab = 'total';
    this.todos = this.userData.activeTodos;
    this.ref.detectChanges();
    this.service.toastr.warning('Completed todos are removed!');
  }
}
