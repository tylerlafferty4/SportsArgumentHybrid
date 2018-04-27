import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { TabsPage } from '../pages/tabs/tabs';

import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyC2rXKC1vPrcky103LbHmti30w-2vZWv6A",
  authDomain: "fiery-torch-8713.firebaseapp.com",
  databaseURL: "https://fiery-torch-8713.firebaseio.com",
  projectId: "fiery-torch-8713",
  storageBucket: "fiery-torch-8713.appspot.com",
  messagingSenderId: "102813551545"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  @ViewChild(Nav) navChild: Nav;

  constructor(
    platform: Platform, 
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public fcm: FCM
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      firebase.initializeApp(config);

      this.fcm.getToken().then(token => {
        // Your best bet is to here store the token on the user's profile on the
        // Firebase database, so that when you want to send notifications to this 
        // specific user you can do it from Cloud Functions.
      });

      this.fcm.onNotification().subscribe( data => {
        if(data.wasTapped){
          //Notification was received on device tray and tapped by the user.
          // let jsonData = data.data.roomkey;
          // alert(jsonData);
        } else {
          //Notification was received in foreground. Maybe the user needs to be notified.
        }
      });
    });
  }
}
