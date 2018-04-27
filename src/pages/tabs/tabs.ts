import { Component, ViewChild } from '@angular/core';
import { NavParams, Tabs } from 'ionic-angular';
import { TwitterPage } from '../twitter/twitter';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { PhotoWallPage } from '../photo-wall/photo-wall';
import { PodcastsPage } from '../podcasts/podcasts';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = LoginPage;
  tab3Root = PhotoWallPage;
  tab4Root = TwitterPage;
  tab5Root = PodcastsPage;

  constructor(private navParams: NavParams) {

  }
}
