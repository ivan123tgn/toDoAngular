import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

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
  constructor(private firestore: AngularFirestore, public auth: AngularFireAuth) { }

  public async getTodos() {
    const array:toDo[]=[];
    const todos = await this.firestore.collection("todos").get().toPromise();
    console.log(todos);
    if (todos && todos.docs) {
      todos.docs.forEach((el) => {
        console.log(el.data());
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

  public async getUserId() {
    this.userid = await firebase.auth().currentUser?.uid;
  }

  public loginGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  public logout() {
    this.auth.signOut();
  }

  public loginEmail() {

  }


}
