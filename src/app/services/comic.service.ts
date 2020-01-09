import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

const COMIC_API = `${environment.API_END_POINT}`;

@Injectable({
  providedIn: 'root'
})
export class ComicService {

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private platform: Object,
    private cookieService: CookieService,
    private readonly router: Router) { }

  public getComicChapters(comicSlug): Observable<any> {
    const url = `${COMIC_API}${comicSlug}/index.json`;
    return this.http.get<any>(url);
  }

  public getOperatingSystem(): string {
    let currentDevice;
    if (isPlatformBrowser(this.platform)) {
      const userAgent = navigator.userAgent || navigator.vendor;
      if (/android/i.test(userAgent)) {
        currentDevice = 'androidBrowser';
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        currentDevice = 'iosBrowser';
      } else {
        currentDevice = 'desktopBrowser';
      }
    } else {
      currentDevice = 'desktopBrowser';
    }
    return currentDevice;
  }

  public getCurrentUrl(): string {
    return this.router.url.split('?')[0];
  }

  public openInStore() {
    const linkData = this.getBranchLinkData();
    if (isPlatformBrowser(this.platform)) {
      if (window && window['branch']) {
        window['branch'].link(linkData, (err, link) => {
          console.log(link);
          location.href = link;
        });
      }
    }
  }

  public sendMessage(linkData, linkOptions, phone) {
    const callback = (err, result) => {
      if (err) {
        alert('Something went wrong.');
      } else {
        alert('Text message was sent successfully.');
      }
    };
    if (isPlatformBrowser(this.platform)) {
      window['branch'].sendSMS(phone, linkData, linkOptions, callback);
    }
  }

  public getBranchLinkData(): any {
    const referredByCookie = this.cookieService.get('referred_by');
    const currentUrl = this.getCurrentUrl();
    return {
      data: {
        referred_by: referredByCookie,
        deeplink_path: `${COMIC_API}${currentUrl}/index.json`
      }
    };
  }

  public resolvePath(pageURL, url) {
    const relative = url + '';
    if (relative.includes('http')) {
      return relative;
    }
    const base = pageURL;
    if (relative.startsWith('/')) {
      const pathArray = base.split('/');
      const protocol = pathArray[0];
      const host = pathArray[2];
      const url = protocol + '//' + host;
      return url + relative;
    }
    const stack = base.split('/');
    const parts = relative.split('/');
    for (const index in parts) {
      if (parts[index] === '.') {
        continue;
      }
      if (parts[index] === '..') {
        stack.pop();
      } else {
        stack.push(parts[index]);
      }
    }
    const finalUrl = stack.join('/');
    return finalUrl;
  }

}

