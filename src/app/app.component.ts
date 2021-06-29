import {Component, OnInit} from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {TodoServiceService} from "./services/todo-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'toDoAngular';


  constructor(public service:TodoServiceService) {

  }

  async ngOnInit() {
    await this.service.checkUser({});
  }



}
