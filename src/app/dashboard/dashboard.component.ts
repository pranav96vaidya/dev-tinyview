import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { FormGroup, FormControl } from '@angular/forms';
import * as PostActions from '../redux/action';
import { Store } from '@ngrx/store';
import { Post } from '../redux/model';

interface AppState {
  post: Post;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tableData: firebase.functions.HttpsCallableResult;
  isLoading: boolean;
  userForm: FormGroup;
  dates: Array<any> = [];
  preparedData: any;

  constructor(
    public authService: AuthService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new PostActions.EditText('Dashboard'));
    this.userForm = new FormGroup({
      dateVal: new FormControl(0)
    });
    this.dates = [
      { key: 0, value: 'Today'},
      { key: 1, value: 'Yesterday'},
      { key: 7, value: 'Last 7 Days'},
      { key: 30, value: 'Last 30 Days'},
      { key: -1, value: 'All-time'}
    ];
    this.getData(0);
  }

  public onSubmit(): void {
    this.getData(this.userForm.value.dateVal);
  }

  public getData(dateVal) {
    this.isLoading = true;
    const getDashboardData = firebase.functions().httpsCallable('getDashboardData');
    getDashboardData({ timeFilter: +dateVal}).then((result) => {
      this.tableData = result;
      const days = +dateVal;
      this.preparedData = {};
      if (days === -1) {
        this.preparedData['all'] = {
          utcTime: '-',
          users: [],
          transactions: [],
          referrals: [],
          pageViews: [],
          dau: []
        };
        this.preparedData['all'].users = this.tableData.data.users;
        this.preparedData['all'].transactions = this.tableData.data.transactions;
        this.preparedData['all'].referrals = this.tableData.data.referrals;
        this.preparedData['all'].pageViews = this.tableData.data.pageViews;
        this.preparedData['all'].dau = this.tableData.data.dau;
        this.isLoading = false;
      } else {
        this.prepareTableData(this.tableData.data, 'users');
        this.prepareTableData(this.tableData.data, 'transactions');
        this.prepareTableData(this.tableData.data, 'referrals');
        this.prepareTableData(this.tableData.data, 'pageViews');
        this.prepareTableData(this.tableData.data, 'dau');
      }
    });
  }

  public prepareTableData(data, item) {
    const items = data[item];
    for (let i = 0; i < items.length; i++) {
      const dateVal = new Date(items[i].createdTime);
      dateVal.setUTCHours(0, 0, 0, 0);
      const epochTime = dateVal.getTime();
      if (epochTime in this.preparedData) {
        this.preparedData[epochTime][item].push(items[i].createdTime);
        continue;
      }
      const day = dateVal.getDate();
      const month = dateVal.getMonth() + 1;
      const year = dateVal.getFullYear();
      const dateStr = month + '/' + day + '/' + year;
      this.preparedData[epochTime] = {
        utcTime: dateStr,
        users: [],
        transactions: [],
        referrals: [],
        pageViews: [],
        dau: []
      };
      this.preparedData[epochTime][item].push(items[i].createdTime);
    }
    this.isLoading = false;
  }
}
