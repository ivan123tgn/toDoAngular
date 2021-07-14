import {Injectable, Input} from '@angular/core';
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
  id: string;
}

export interface userData{
  id: string;
  email: string;
  activeTodos: toDo[];
  completedTodos: toDo[];
  removedTodos: toDo[];
}

@Injectable({
  providedIn: 'root'
})

export class TodoServiceService {

  constructor(
    private firestore: AngularFirestore,
    public auth: AngularFireAuth,
    public toastr: ToastrService) {}

  public async getUserData(user:string) {
    return await this.firestore.collection('todoUsers').doc(user).get().toPromise();
  }

  public emailReg(email:string, password:string) {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.toastr.success('You are successfully signed up!', 'Sign Up');
        console.log('You are Successfully signed up!', res);
        const user = res.user?.uid;
        if (user) {
          this.createDocumentInDatabase(user,email);
        }
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

  public logout() {
    this.auth.signOut().then(res => this.toastr.warning('You are logged out.'), err => this.toastr.error('Log Out Error!'));
  }

  public loginGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(res => {
              this.toastr.success('You are successfully signed in!', 'Sign In');
              const email = res.user?.email;
              const user = res.user?.uid;
              if(user) {
                this.getUserData(user).then(res => {
                  if (!res.data()) {
                    //If Google User Does Not Exist
                    this.createDocumentInDatabase(user, email);
                  }
                });
              }
            },
            err => this.toastr.error(err.message,'SignIn'));
  }

  public createDocumentInDatabase(id:string, email:any) {
    const userData = {
      id: id,
      email: email,
      activeTodos: [],
      completedTodos: [],
      removedTodos: [],
    };
    this.firestore.collection("todoUsers").doc(id).set(userData)
      .then(() => {
        console.log("Document successfully written!");
      });
  }

  public async updateUserData(userData:userData) {
    this.firestore.collection("todoUsers").doc(userData.id).set(userData)
      .then(() => {
        console.log("Document successfully updated!");
      });
  }





  //Old//
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









}
