import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComicService } from '../services/comic.service';
const COMIC_IMG_API = `${environment.API_END_POINT}`;

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input() comicData;
  imgUrl: string;
  nextRoute: string;
  currentUrl: string;
  userSubscription: Subscription;
  currentDevice: string;
  willRender: boolean;
  renderDownloadAndroid: boolean;
  renderDownloadIos: boolean;
  renderDesktop: boolean;
  actionWebsite: boolean;
  actionTinyview: boolean;
  smsResponse: string;
  href: string;

  constructor(
    private readonly router: Router,
    private readonly comicService: ComicService
  ) { }

  ngOnInit() {
    this.currentDevice = this.comicService.getOperatingSystem();
    this.currentUrl = this.comicService.getCurrentUrl();
    if (this.currentUrl === '/') {
      this.imgUrl = `${COMIC_IMG_API}/${this.comicData.image}`;
    } else {
      this.imgUrl = `${COMIC_IMG_API}${this.currentUrl}/${this.comicData.image}`;
    }
    this.willRender = this.willGetRender(this.comicData);
    if (this.comicData.actionType === 'tinyview') {
      this.actionTinyview = true;
      this.renderDownloadAndroid = this.comicData.action === 'download-app-android';
      this.renderDownloadIos = this.comicData.action === 'download-app-ios';
      this.renderDesktop = this.comicData.action === 'send-me-the-app';
    } else if (this.comicData.actionType === 'website') {
      this.actionWebsite = true;
      this.href = this.comicData.action;
    } else {
      this.nextRoute = this.getNavigateUrl();
    }
  }

  public getNavigateUrl(): string {
    if (this.comicData && this.comicData.action) {
      let urlPath;
      if (this.currentUrl === '/') {
        urlPath = '';
      } else {
        urlPath = this.currentUrl;
      }
      const action = this.comicService.resolvePath(urlPath, this.comicData.action);
      const len = action && action.lastIndexOf('/');
      const res = action && action.substring(0, len);
      return `${res}`;
    }
    return null;
  }

  public navigateToRoute() {
    this.router.navigate([this.nextRoute]);
  }

  public willGetRender(imageData): boolean {
    if (imageData.platforms === undefined) {
      return true;
    } else {
      for (const platform of imageData.platforms) {
        if (platform.hasOwnProperty(this.currentDevice)) {
          return true;
        }
      }
    }
    return false;
  }

  public openApp(): void {
    this.comicService.openInStore();
  }

}
