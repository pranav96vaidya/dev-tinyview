import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ComicService } from '../services/comic.service';
import { Store } from '@ngrx/store';
import { Post } from '../redux/model';
import * as PostActions from '../redux/action';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
const COMIC_IMG_API = `${environment.API_END_POINT}`;

interface AppState {
  post: Post;
}

@Component({
  selector: 'app-comic',
  templateUrl: './comic.component.html',
  styleUrls: ['./comic.component.scss']
})
export class ComicComponent implements OnInit, OnDestroy {
  myform: FormGroup;
  chapterList: any;
  userSubscription: Subscription;
  errorMsg: string;
  isPaid: boolean;
  fetchDone: boolean;
  imgPath: string;
  smsResponse: string;
  hideOpenInApp: boolean;
  currentDevice: string;

  constructor(
    private readonly comicService: ComicService,
    private readonly route: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platform: Object,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.myform = new FormGroup({
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10)])
    });
    this.currentDevice = this.comicService.getOperatingSystem();
    this.userSubscription = this.route.url.subscribe(url => {
      if (isPlatformBrowser(this.platform)) {
        document.querySelector('.mat-sidenav-content').scrollTop = 0;
      }
      this.smsResponse = null;
      let currentUrl = '';
      for (const fragmentValue of url) {
        currentUrl += '/' + fragmentValue;
      }
      this.comicService.getComicChapters(currentUrl)
        .subscribe(resp => {
          this.titleService.setTitle(resp.comics.title);
          this.hideOpenInApp = resp && resp.comics && resp.comics.hideOpenInApp;
          if (resp.comics.ogImage) {
            this.imgPath = `${COMIC_IMG_API}${this.comicService.resolvePath(currentUrl, resp.comics.ogImage)}`;
          } else {
            this.imgPath = 'https://storage.googleapis.com/tinyview-d78fb.appspot.com/tinyview/tinyview-fb-cover.jpg';
          }
          const metaData = [
            { property: 'twitter:description', content: resp.comics.description},
            { property: 'twitter:image', content: `${this.imgPath}` },
            { property: 'twitter:title', content: resp.comics.title },
            { property: 'og:title', content: resp.comics.title },
            { property: 'og:description', content: resp.comics.description },
            { property: 'og:image', content: `${this.imgPath}` },
            { property: 'og:url', content: `https://tinyview.com${currentUrl}` },
          ];
          for (const metaProperty of metaData) {
            this.meta.updateTag({ property: metaProperty.property, content: metaProperty.content });
          }
          this.store.dispatch(new PostActions.EditText(resp.comics.title));
          this.fetchDone = false;
          this.errorMsg = null;
          if (resp && resp.comics && resp.comics.inAppProducts) {
            this.chapterList = resp && resp.comics && resp.comics.panels && [resp.comics.panels[0]];
            this.isPaid = true;
          } else {
            this.chapterList = resp && resp.comics && resp.comics.panels;
            this.isPaid = false;
          }
          this.fetchDone = true;
          this.errorMsg = null;
        }, err => {
          this.fetchDone = true;
          this.errorMsg = 'No data found!';
        });
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  public openApp(): void {
    this.comicService.openInStore();
  }

  public sendSMS(): void {
    const linkData = this.comicService.getBranchLinkData();
    const linkOptions = {
      make_new_link: false
    };
    const phone = this.myform.value.phone;
    this.comicService.sendMessage(linkData, linkOptions, phone);
  }

}
