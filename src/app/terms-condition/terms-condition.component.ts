import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PostActions from '../redux/action';
import { Post } from '../redux/model';
import { Meta } from '@angular/platform-browser';

interface AppState {
  post: Post;
}

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit {

  constructor(private store: Store<AppState>,
    private meta: Meta) { }

  ngOnInit() {
    const metaData = [
      { property: 'twitter:description', content: 'Terms and Conditions'},
      { property: 'twitter:image',
      content: 'https://storage.googleapis.com/tinyview-d78fb.appspot.com/tinyview/tinyview-fb-cover.jpg' },
      { property: 'twitter:title', content: 'Terms and Conditions' },
      { property: 'og:title', content: 'Terms and Conditions' },
      { property: 'og:description', content: 'Terms and Conditions' },
      { property: 'og:image',
      content: 'https://storage.googleapis.com/tinyview-d78fb.appspot.com/tinyview/tinyview-fb-cover.jpg' },
      { property: 'og:url', content: 'https://tinyview.com/terms-conditions' },
    ];
    for (const metaProperty of metaData) {
      this.meta.updateTag({ property: metaProperty.property, content: metaProperty.content });
    }
    this.store.dispatch(new PostActions.EditText('Terms and Conditions'));
  }

}
