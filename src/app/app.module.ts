import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { TodoServiceService } from './services/todo-service.service';
import {AngularFireAuthModule} from "@angular/fire/auth";
import {TodoLoginComponent} from "./todo-login/todo-login.component";
import { ToastrModule } from 'ngx-toastr';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireFunctionsModule} from "@angular/fire/functions";
import {MatTabsModule} from '@angular/material/tabs';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoLoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSliderModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ToastrModule.forRoot(),
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    ReactiveFormsModule,
    AngularFireFunctionsModule,
    MatTabsModule,
    MatBottomSheetModule,
  ],
  providers: [TodoServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }


