import { Injectable, NgZone } from '@angular/core';
import { User } from './user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user$: Observable<User>;
  userData;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.ngZone.run(() => {
      this.router.navigate(['login']);
    });
  }

  private updateUserData({uid, email, displayName, photoURL, emailVerified}: User) {
    console.log('test', uid, email, displayName);
    const data = {
      uid,
      email,
      displayName,
      photoURL,
      emailVerified
    };
    console.log(data);
    this.userData = data;
  }

  signIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.updateUserData(result.user);
      }).catch((error) => {
        console.log(error);
        window.alert(error.message);
      });
  }
}
