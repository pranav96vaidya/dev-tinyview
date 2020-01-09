import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PostActions from '../redux/action';
import { Post } from '../redux/model';
import { Meta, Title } from '@angular/platform-browser';

interface AppState {
  post: Post;
}

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private meta: Meta) { }

  ngOnInit() {
    const metaData = [
      { property: 'twitter:description', content: 'Privacy Policy'},
      { property: 'twitter:image',
      content: 'https://storage.googleapis.com/tinyview-d78fb.appspot.com/tinyview/tinyview-fb-cover.jpg' },
      { property: 'twitter:title', content: 'Privacy Policy' },
      { property: 'og:title', content: 'Privacy Policy' },
      { property: 'og:description', content: 'Privacy Policy' },
      { property: 'og:image',
      content: 'https://storage.googleapis.com/tinyview-d78fb.appspot.com/tinyview/tinyview-fb-cover.jpg' },
      { property: 'og:url', content: 'https://tinyview.com/privacy-policy' },
    ];
    for (const metaProperty of metaData) {
      this.meta.updateTag({ property: metaProperty.property, content: metaProperty.content });
    }
    this.store.dispatch(new PostActions.EditText('Privacy Policy'));
  }

}
