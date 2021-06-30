import {Component} from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import {TodoServiceService} from "../services/todo-service.service";

@Component({
  selector:'todo-login',
  styleUrls:['todo-login.component.css'],
  templateUrl:'todo-login.component.html'
})

export class TodoLoginComponent {
  constructor(public service:TodoServiceService, public auth: AngularFireAuth) {
  }

}
