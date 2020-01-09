import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Post } from './redux/model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
interface AppState {
  post: Post;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  post: Observable<Post>;
  title = 'Tinyview';
  isBrowser;
  showBtn: boolean;

  constructor(
    private store: Store<AppState>,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private platform: Object,
    private cookieService: CookieService) {
     }

  ngOnInit() {
    const cookie = this.cookieService;
    const router = this.router;
    if (isPlatformBrowser(this.platform)) {
      if (window && window['branch']) {
        window['branch'].init('key_live_jbPTddmEZ71QQJo1ogw4mnecqscKHaiG', (err, data) => {
          cookie.set('referring_link', data.data_parsed['~referring_link'], 7);
          if (data && data.data_parsed && data.data_parsed.referred_by) {
            console.log(data.data_parsed.referred_by);
            cookie.set('referred_by', data.data_parsed.referred_by, 7);
          }
        });
      }
    }
    this.post = this.store.select('post');
  }
}
