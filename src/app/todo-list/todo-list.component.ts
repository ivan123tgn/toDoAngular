import { Component, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { toDo, TodoServiceService } from '../services/todo-service.service';
import {firebase} from "firebaseui-angular";
import {AngularFireAuthModule} from "@angular/fire/auth";



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
  userid:string = '';

  constructor(private service:TodoServiceService, public auth:AngularFireAuthModule) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userid = user.uid;
      } else {
        this.userid = '';
      }
      this.service.getTodos(this.userid)
        .then(todosFromService => {
          this.todos = todosFromService;
          if (this.todos) {
            this.listedTodos = this.todos.filter(el => !el.deleted);
            this.removedTodos = this.todos.filter(el => el.deleted);
            this.todos = this.listedTodos;
          }
        });
    });
  }

  async ngOnInit() {
    // const user = this.service.getUserId() ;
    // console.log(user);
    // // this.userid = this.service.userid;
    // const todos = await this.service.getTodos();
    // // console.log(todos);
    // if (todos) {
    //    this.listedTodos = todos.filter(el => !el.deleted);
    //    this.todos = this.listedTodos;
    //    this.removedTodos = todos.filter(el => el.deleted);
    // }
  }

  addSymbol(event:any) {
    if(event.keyCode === 13) {
      const todoData = {
        value: this.mainInput,
        completed: false,
        deleted: false,
        createdBy: this.userid
      };
      this.listedTodos.push(todoData);
      this.service.addTodo(todoData);
      this.mainInput = '';
    }
    this.todos = this.listedTodos;
  }

  calcActive() {
    return this.listedTodos.filter(todo => !todo.completed && !todo.deleted).length;
  }

  calcCompleted() {
    return this.listedTodos.filter(todo => todo.completed && !todo.deleted).length;
  }

  removeTodo(item: toDo) {
    this.todos = this.todos.filter(todo => todo !== item);
    item.deleted = true;
    this.removedTodos.push(item);
    this.listedTodos = this.todos.filter(todo => todo.deleted === false);
    if(item.id) {
      this.service.updateTodo(item.id,{deleted: true})
    }
  }

  showRemoved(event:any) {
    this.todos = this.removedTodos;
    this.tab = 'removed';
  }

  showTotal(event:any) {
    this.todos = this.listedTodos.filter(todo => !todo.deleted);;
    this.tab = 'total';
  }

  showActive(event:any) {
    this.todos = this.listedTodos.filter(todo => !todo.completed && !todo.deleted);
    this.tab = 'active';
  }

  showCompleted(event:any) {
    this.todos = this.listedTodos.filter(todo => todo.completed && !todo.deleted);
    this.tab = 'completed';
  }

  removeCompleted(event:any) {
    const array = this.listedTodos.filter(todo => todo.completed);
    array.forEach(el => {
      el.deleted = true;
      if(el.id) {
        this.service.updateTodo(el.id,{deleted: true});
      }
      this.removedTodos.push(el);
    })
    this.listedTodos = this.listedTodos.filter(todo => todo.completed === false);
    this.todos = this.listedTodos;
    this.tab = 'total';
  }

  restoreTodo(item:toDo) {
    const index = this.removedTodos.indexOf(item);
    if (index > -1) {
      this.removedTodos.splice(index, 1);
      item.deleted = false;
      if(item.id) {
        this.service.updateTodo(item.id,{deleted: false})
      }
      this.listedTodos.push(item);
    }
  }

  restoreAll(event:any) {
    while (this.removedTodos.length !== 0) {
      let shifted:any = this.removedTodos.shift();
      shifted.deleted = false;
      if(shifted.id) {
        this.service.updateTodo(shifted.id,{deleted: false});
      }
      this.listedTodos.push(shifted);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
  }

  removeForever(item:toDo){
    this.removedTodos = this.removedTodos.filter(todo => todo !== item);
    if(item.id) {
      this.service.removeForever(item.id);
    }
    this.todos = this.removedTodos;
  }
}
