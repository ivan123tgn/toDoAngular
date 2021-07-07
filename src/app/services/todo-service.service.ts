import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import {TodoLoginComponent} from "../todo-login/todo-login.component";
import {AngularFireDatabase} from "@angular/fire/database";
import { ToastrService } from 'ngx-toastr';

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
  userid:any = '';
  showEmailReg:boolean = false;
  constructor(
    private firestore: AngularFirestore,
    public auth: AngularFireAuth,
    private toastr: ToastrService) { }

  public async getTodos(user:string) {
    const array:toDo[]=[];
    const todos = await this.firestore.collection("todos", ref => ref.where('createdBy','==',user)).get().toPromise();
    if (todos && todos.docs) {
      todos.docs.forEach((el) => {
        array.push(<toDo>el.data());
      })
    }
    return array;
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
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(res => this.toastr.success('You are successfully signed in!', 'Sign In'), err => this.toastr.error(err.message,'SignIn'));
  }

  public logout() {
    this.auth.signOut().then(res => this.toastr.warning('You are logged out.'), err => this.toastr.error('Log Out Error!'));
  }

  public showLoginEmail() {
    this.showEmailReg = !this.showEmailReg;
  }

  public emailReg(email:string, password:string) {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.toastr.success('You are successfully signed up!', 'Sign Up');
        console.log('You are Successfully signed up!', res);
      })
      .catch(error => {
        this.toastr.error(error.message,'SignUp');
        console.log('Something is wrong:', error.message);
      });
  }

  public emailLogin(email:string, password:string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        this.toastr.success('You are successfully signed in!', 'Sign In');
        console.log('You are Successfully logged in!', res);
      })
      .catch(err => {
        this.toastr.error(err.message,'SignIn');
        console.log('Something is wrong:',err.message);
      });
  }
}
