import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { AddRoomPage } from '../add-room/add-room';
import { ChatPage } from '../chat/chat';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { User, LoginPage } from '../login/login';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { AD_MOB_SHOW_ADS, AD_MOB_AUTO_SHOW, AD_MOB_ID, AD_MOB_TESTING } from '../../config/ad-mob-config';
import { InviteUserPage } from '../invite-user/invite-user';

@Component({
  selector: 'locker-rooms-page',
  templateUrl: 'locker-rooms.html'
})
export class LockerRoomsPage {

  user = firebase.auth().currentUser;
    rooms = [];
    privaterooms = [];
    ref = firebase.database().ref('chatrooms/');
    privateref = firebase.database().ref('privaterooms/');// .orderByChild('key/key/messageCount');

  public url: string = 'http://sportsargument.com/login';
  
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private adMob: AdMobFree,
    private alertCtrl: AlertController
  ) {
    this.ref.on('value', resp => {
        this.rooms = [];
        this.rooms = snapshotToArray(resp);
        this.determineRoomSort();
    });
    this.privateref.on('value', resp => {
      this.privaterooms = [];
      this.privaterooms = snapshotToArray(resp);
      this.determinePrivateRooms();
    });
    if (AD_MOB_SHOW_ADS) {
      this.showBannerAd();
    }
  }

  determinePrivateRooms() {
    let myPrivate = [];
    for(let room of this.privaterooms) {
      if (room.owner === this.user.email) {
        myPrivate.push(room);
      } else {// if (room.users.indexOf(this.user.email) > -1) {
        firebase.database().ref('privaterooms/'+room.key+'/users').on('value', resp => {
          let privates = snapshotToArray(resp);
          for(let item of privates) {
            if (item.userEmail === this.user.email) {
              myPrivate.push(room);
            }
          }
        });
       // myPrivate.push(room);
      }
    }
    this.privaterooms = myPrivate;
  }

  determineRoomSort() {
    let tempRooms = [];
    let noDataRooms = [];
    console.log('Rooms -> ' + this.rooms.length);
    for(let room of this.rooms) {
      if (room.infoUpdate) {
        tempRooms.push(room);
      } else {
        noDataRooms.push(room);
      }
    }
    console.log('Temp Rooms -> ' + tempRooms.length);
    
    // tempRooms.sort((n1,n2) => n2.infoUpdate.messageCount -  n1.infoUpdate.messageCount);
    tempRooms.sort(function(a,b) { 
      return new Date(b.infoUpdate.dateSent).getTime() - new Date(a.infoUpdate.dateSent).getTime();
    });
  
    this.rooms = tempRooms;
    if (noDataRooms.length > 0) {
      for(let room of noDataRooms) {
        this.rooms.unshift(room);
      }
    }
  }

  ionViewDidEnter() {
    if (AD_MOB_SHOW_ADS) {
			this.adMob.banner.show();
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

  inviteUser(roomKey) {
    this.navCtrl.push(InviteUserPage, {
      roomkey: roomKey
    });
  }

  addRoom() {
    this.navCtrl.push(AddRoomPage);
  }

  logout() {
      firebase.auth().signOut();
      this.storage.set('userEmail', null);
      this.navCtrl.setRoot(LoginPage);
  }

  joinRoom(key, roomName, room) {
    let user: User;
    this.storage.get('userEmail').then((val) => {
        user = val;
        this.navCtrl.push(ChatPage, {
            key: key,
            roomName: roomName,
            nickname: user,
            isPrivate: false
        });
    });
  }

  joinPrivateRoom(key, roomName, room) {
    let user: User;
    this.storage.get('userEmail').then((val) => {
        user = val;
        this.navCtrl.push(ChatPage, {
            key: key,
            roomName: roomName,
            nickname: user,
            isPrivate: true
        });
    });
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