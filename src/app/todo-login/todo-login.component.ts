import {Component} from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector:'todo-login',
  styleUrls:['todo-login.component.css'],
  templateUrl:'todo-login.component.html'
})

export class TodoLoginComponent {
  constructor(public auth: AngularFireAuth) {
  }

  loginGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }
}
