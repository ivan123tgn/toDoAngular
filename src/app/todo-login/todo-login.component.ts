import {Component, ViewChild} from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import {TodoServiceService} from "../services/todo-service.service";
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector:'todo-login',
  styleUrls:['todo-login.component.css'],
  templateUrl:'todo-login.component.html'
})

export class TodoLoginComponent {
  constructor(public service:TodoServiceService, public auth: AngularFireAuth) {
  }

  password:string = '';
  hidePswd:boolean = true;
  showRegEmail: boolean = false;
  showLogEmail: boolean = false;
  emailForm = new FormControl('', [Validators.required, Validators.email]);

  handleEmailReg() {
    this.service.emailReg(this.emailForm.value, this.password);
    this.emailForm.setValue('');
    this.password = '';
  }

  handleEmailLogin() {
    this.service.emailLogin(this.emailForm.value, this.password);
    this.emailForm.setValue('');
    this.password = '';
  }

  getErrorMessage() {
    if (this.emailForm.hasError('required')) {
      return 'You must enter a value';
    }
    return this.emailForm.hasError('email') ? 'Not a valid email' : '';
  }

}
