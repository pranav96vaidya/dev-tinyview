import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as PostActions from '../redux/action';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Post } from '../redux/model';

interface AppState {
  post: Post;
}

@Component({
selector:  'app-login',
templateUrl:  './login.component.html',
styleUrls: ['./login.component.scss']
})
export  class  LoginComponent  implements  OnInit {
    isLoading: boolean;

    constructor(
        public authService: AuthService,
        private router: Router,
        public afs: AngularFirestore,
        public afAuth: AngularFireAuth,
        public ngZone: NgZone,
        private store: Store<AppState>
    ) { }

    ngOnInit() {
      this.store.dispatch(new PostActions.EditText('Login'));
      this.isLoading = true;
      this.afAuth.authState.subscribe(res => {
          if (res && res.uid) {
            this.ngZone.run(() => {
              this.router.navigate(['dashboard']);
            });
          } else {
            this.isLoading = false;
          }
      });
    }
}
