import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddRoomPage } from '../add-room/add-room';
import { ChatPage } from '../chat/chat';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { User, LoginPage } from '../login/login';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { AD_MOB_SHOW_ADS, AD_MOB_AUTO_SHOW, AD_MOB_ID, AD_MOB_TESTING } from '../../config/ad-mob-config';

@Component({
  selector: 'locker-rooms-page',
  templateUrl: 'locker-rooms.html'
})
export class LockerRoomsPage {

    rooms = [];
    ref = firebase.database().ref('chatrooms/');

  public url: string = 'http://sportsargument.com/login';
  
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private adMob: AdMobFree
  ) {
    this.ref.on('value', resp => {
        this.rooms = [];
        this.rooms = snapshotToArray(resp);
    });
    if (AD_MOB_SHOW_ADS) {
      this.showBannerAd();
    }
  }

  async showBannerAd() {
    try {
      const bannerConfig: AdMobFreeBannerConfig = {
        id: AD_MOB_ID, // /2576122064',
        isTesting: AD_MOB_TESTING,
        autoShow: AD_MOB_AUTO_SHOW
      }

      this.adMob.banner.config(bannerConfig);

      const result = await this.adMob.banner.prepare();
      console.log(result);
    }
    catch (e) {
      console.error(e);
    }
  }

  addRoom() {
    this.navCtrl.push(AddRoomPage);
  }

  logout() {
      firebase.auth().signOut();
      this.storage.set('userEmail', null);
      this.navCtrl.setRoot(LoginPage);
  }

  joinRoom(key, roomName) {
      console.log('Room Name is -> ' + roomName);
      
    let user: User;
    this.storage.get('userEmail').then((val) => {
        user = val;
        this.navCtrl.push(ChatPage, {
            key: key,
            roomName: roomName,
            nickname: user
        });
    });
  }
  // public browser = this.iab.create('https://ionicframework.com/');

  
  ionViewDidLoad() {
    // ReadyUI.setUrl("http://www.sportsargument.com/cometchat/");
    // CCCometChat.initializeCometChat("http://www.sportsargument.com/cometchat/", "U7BJC-7VWFL-CF3JE-BFEL4-VT5WT", apiKey, "NO", this.successCallback(response){}, this.failCallback(response){});
    // this.readyUI.loginWithUsername("John","passw0rd", this.callbackmeth);
    // this.tb.create('https://ionicframework.com/');

    // this.iab.create('http://sportsargument.com/login/?redirect_to=http://sportsargument.com/redirector');
    // this.iab.
    // const browser: ThemeableBrowserObject = this.tb.create('https://ionicframework.com/', '_blank', this.options);
  }

    closeInAppBrowser(event) {
        if (event.url.match("/close")) {

        }
}

  successCallback(result){
            
    alert(result);
            
  }

}

export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};