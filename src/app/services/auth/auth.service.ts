import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Admin } from 'src/app/models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: any = null;
  authId: any;
  public admin: Admin;

  constructor(
    public angularFireAuth: AngularFireAuth,
    public router: Router
  ) {
    this.angularFireAuth.authState.subscribe(auth => {
      this.authState = auth;
    })
  }

  get currentUserId(): string {
    return (this.authState !== null) ? this.authId : '';
  }

  get currentEmail(): string {
    return this.authState['email'];
  }

  register(email: string, password: string) {
    this.angularFireAuth.createUserWithEmailAndPassword(email, password).catch(err => {
      throw err;
    })
  }

  login(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(user => {
      this.authState = user;
      this.authId = user.user.uid;
    }).catch(err => {
      throw err;
    })
  }

  signOut(): void {
    localStorage.clear();
    this.angularFireAuth.signOut();
  }

  delete(email: string, password: string) {
    this.admin = JSON.parse(localStorage.getItem('admin'));
    if (email == this.admin.email && password == this.admin.password) {
      return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(user => {
        user.user.delete();
        localStorage.clear();
      }).catch(err => {
        throw err;
      })
    } else {
      this.angularFireAuth.signInWithEmailAndPassword(email, password).then(user => {
        user.user.delete();
      }).catch(err => {
        throw err;
      })
      return this.angularFireAuth.signInWithEmailAndPassword(this.admin.email, this.admin.password).then(user => {
        this.authState = user;
        this.authId = user.user.uid;
      }).catch(err => {
        throw err;
      })
    }
  }
}
