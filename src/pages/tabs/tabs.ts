import { Component } from '@angular/core';

import { LockerRoomsPage } from '../locker-rooms/locker-rooms';
import { TwitterPage } from '../twitter/twitter';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { PodcastsPage } from '../podcasts/podcasts';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = LockerRoomsPage;
  tab3Root = TwitterPage;
  tab4Root = PodcastsPage;

  constructor() {

  }
}
