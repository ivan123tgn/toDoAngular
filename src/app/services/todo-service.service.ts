import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import {TodoLoginComponent} from "../todo-login/todo-login.component";
import {AngularFireDatabase} from "@angular/fire/database";
import {TodoListComponent} from "../todo-list/todo-list.component";
import {resolve} from "@angular/compiler-cli/src/ngtsc/file_system";

export interface toDo{
  value: string;
  completed: boolean;
  deleted: boolean;
  id?: string;
  createdBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoServiceService {
  public userid:any = '';
  showEmailReg:boolean = false;
  constructor(public firestore: AngularFirestore, public auth: AngularFireAuth) {
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     this.userid = user.uid;
    //     console.log('check_auth,yes');
    //     this.getTodos();
    //   } else {
    //     this.userid = '';
    //     console.log('check_auth,no')
    //     this.getTodos();
    //   }
    // });
  }

  // public async getTodos() {
  //   const array:toDo[]=[];
  //   console.log('get todos')
  //   const todos = await this.firestore.collection("todos").get().toPromise();
  //   if (todos && todos.docs) {
  //     todos.docs.forEach((el) => {
  //       array.push(<toDo>el.data());
  //     })
  //   }
  //   return array;
  // }

  public async initTodos() {
    await this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userid = user.uid;
        console.log('check_auth,yes');
        // this.getTodos();
      } else {
        this.userid = '';
        console.log('check_auth,no')
        //this.getTodos();
      }
      console.log(this.userid);
      const data = this.getTodos();
      console.log(data);
      // return data;
      // return(a);
    });
  }

  public async getTodos() {
    let array:toDo[]=[];
    let listedArray:toDo[]=[];
    let removedArray:toDo[]=[];

    console.log('get todos')
    console.log(this.userid);
    const todos = await this.firestore.collection("todos").get().toPromise();
    if (todos && todos.docs) {
      todos.docs.forEach((el) => {
        array.push(<toDo>el.data());
      })
      listedArray = array.filter(el => !el.deleted);
      removedArray = array.filter(el => el.deleted);
    }
    return [array, listedArray, removedArray];
  }

  public async addTodo(todoData:toDo) {
    this.firestore.collection("todos").add(todoData).then(data => {
      this.firestore.collection("todos").doc(data.id).set({id:data.id},{merge:true});
    })
  }

  public async updateTodo(id:string,data:any) {
    this.firestore.collection("todos").doc(id).update(data);
  }

  public async removeForever(id:string) {
    this.firestore.collection("todos").doc(id).delete();
  }

  public loginGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  public logout() {
    this.auth.signOut();
  }

  public showLoginEmail() {
    this.showEmailReg = !this.showEmailReg;
  }

  public emailReg(email:string, password:string) {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log('You are Successfully signed up!', res);
      })
      .catch(error => {
        console.log('Something is wrong:', error.message);
      });
  }

  public emailLogin(email:string, password:string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('You are Successfully logged in!');
      })
      .catch(err => {
        console.log('Something is wrong:',err.message);
      });
  }
}
