import {Component} from '@angular/core';
import {TodoServiceService} from "./services/todo-service.service";
import {firebase} from "firebaseui-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'toDoAngular';


  constructor(public service:TodoServiceService) {
  }

}
