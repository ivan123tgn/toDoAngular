import {Injectable, Input} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { ToastrService } from 'ngx-toastr';
import {AngularFireFunctions} from "@angular/fire/functions";
import {formatDate} from "@angular/common";

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

export interface message{
  subject: string;
  html: string;
}

@Injectable({
  providedIn: 'root'
})

export class TodoServiceService {

  constructor(
    private firestore: AngularFirestore,
    public auth: AngularFireAuth,
    public toastr: ToastrService,
    public fns: AngularFireFunctions) {}

  public async getUserData(user:string) {
    return await this.firestore.collection('todoUsers').doc(user).get().toPromise();
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

  public logout() {
    this.auth.signOut().then(res => this.toastr.warning('You are logged out.'), err => this.toastr.error('Log Out Error!'));
  }

  public loginGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(res => {this.toastr.success('You are successfully signed in!', 'Sign In')},
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
    return userData;
  }

  public async updateUserData(userData:userData) {
    this.firestore.collection("todoUsers").doc(userData.id).set(userData)
      .then(() => {
        console.log("Document successfully updated!");
      });
  }

  public sendEmail(to:string, message:message) {
    const emailText = {
      to: to,
      message: message,
    };
    this.firestore.collection("mail").doc(Date.now().toString()).set(emailText)
      .then(() => {
        console.log("Email is successfully created!");
      });
  }

}
