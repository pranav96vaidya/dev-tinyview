import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComicComponent } from './comic/comic.component';
import { FooterComponent } from './footer/footer.component';
import { ImageComponent } from './image/image.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreModule } from '@ngrx/store';
import { Reducer } from './redux/reducer';
import { DataNotFoundComponent } from './shared/data-not-found/data-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule, MatIconModule } from '@angular/material';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './services/auth.service';

const config = {
  apiKey: 'AIzaSyDWO4UBnpiC4_1gh6xd_ezLR9UoT8f_ZfI',
  authDomain: 'tinyview-dev.firebaseapp.com',
  databaseURL: 'https://tinyview-dev.firebaseio.com',
  projectId: 'tinyview-dev',
  storageBucket: 'tinyview-dev.appspot.com',
  messagingSenderId: '535922886764',
  appId: '1:535922886764:web:d2d367bfa314ae77037049',
  measurementId: 'G-6CML64TQ2Z'
};

@NgModule({
  declarations: [
    AppComponent,
    ComicComponent,
    FooterComponent,
    ImageComponent,
    DataNotFoundComponent,
    PrivacyPolicyComponent,
    TermsConditionComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    AngularFireModule.initializeApp(config),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    TransferHttpCacheModule,
    BrowserModule.withServerTransition({ appId: 'devServerApp' }),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    StoreModule.forRoot({
      post: Reducer
    })
  ],
  providers: [
    CookieService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
