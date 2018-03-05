import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import * as firebase from 'firebase';

declare var ReadyUI;

const config = {
  apiKey: 'AIzaSyC2rXKC1vPrcky103LbHmti30w-2vZWv6A',
  authDomain: 'fiery-torch-8713.firebaseapp.com',
  databaseURL: 'https://fiery-torch-8713.firebaseio.com/',
  projectId: 'fiery-torch-8713',
  storageBucket: 'gs://fiery-torch-8713.appspot.com',
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      firebase.initializeApp(config);
    });
  }
}
