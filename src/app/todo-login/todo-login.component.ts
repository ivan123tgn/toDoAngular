import {Component, OnDestroy, OnInit} from "@angular/core";
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import {AngularFireAuth} from "@angular/fire/auth";
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Router} from "@angular/router";

@Component({
  selector:'todo-login',
  styleUrls:[],
  template:`
    <div>
      Login component test
    </div>>
  `
})

export class TodoLoginComponent implements OnInit,OnDestroy {
  ui: firebaseui.auth.AuthUI;

  constructor(private afAuth: AngularFireAuth,
              private router:Router) {}

  ngOnInit() {
    this.afAuth.app.then(app => {
      const uiConfig = {
        signInOptions: [
          EmailAuthProvider.PROVIDER_ID,
          GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)
        }
      };

      this.ui = new firebaseui.auth.AuthUI(app.auth());
      this.ui.start("#firebase-auth-container", uiConfig);
      this.ui.disableAutoSignIn();
    })
  }

  ngOnDestroy() {
    this.ui.delete();
  }

  onLoginSuccessful(result:any) {
    console.log('Firebase UI result:', result);
    alert('Login!!!');
  }
}
