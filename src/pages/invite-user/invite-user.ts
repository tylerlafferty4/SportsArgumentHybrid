import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { AD_MOB_SHOW_ADS, AD_MOB_AUTO_SHOW, AD_MOB_ID, AD_MOB_TESTING } from '../../config/ad-mob-config';
import { snapshotToArray } from '../locker-rooms/locker-rooms';

export interface user {
  id: string;
  displayName: string;
  email: string;
}
@Component({
  selector: 'page-invite-user',
  templateUrl: 'invite-user.html',
})
export class InviteUserPage {

  roomKey: any;
  users = [];
  filteredUsers = [];
  selectedUsers = [];
  alreadyInUsers = [];
  searchTxt = '';
  searching = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
  ) {
    this.roomKey = this.navParams.get('roomkey');
    // firebase.database().ref('privateRooms/'+this.roomKey+'/users/').on('value', resp => {
    //   this.alreadyInUsers = [];
    //   this.alreadyInUsers = snapshotToArray(resp);
    // });
    firebase.database().ref('users/').on('value', resp => {
      this.users = [];
      this.users = snapshotToArray(resp);
    });
  }

  // determineAlreadyIn() {
  //   for(let user of this.alreadyInUsers) {
  //     console.log('Determinign for -> ' + user.key);
  //     let index = this.users.indexOf(user.key);
  //     if (index > -1) {
  //       this.users.splice(index);
  //     }
  //   }
  // }
  onInput() {
    if (this.searchTxt === '') {
      this.searching = false;
    } else {
      this.searching = true;
    }
    this.filteredUsers = this.users.filter((user) => {
      return user.displayName.toLowerCase().indexOf(this.searchTxt.toLowerCase()) > -1
      || user.email.toLowerCase().indexOf(this.searchTxt.toLowerCase()) > -1;
    });
  } 

  isSelected(userKey) {
    if (this.selectedUsers.indexOf(userKey) > -1) {
      return true;
    } else {
      return false;
    }
  }

  isFilteredSelected(userKey) {
    for(let user of this.filteredUsers) {
      if (this.selectedUsers.indexOf(userKey) > -1) {
        return true;
      }
      return false;
    }
  }

  sendInvite() {
    for(let user of this.selectedUsers) {
      console.log('Sending invite for -> ' + user);
      let newData = firebase.database().ref('privaterooms/'+this.roomKey+'/users').push();
      newData.set({
        userId: user
      });
      let alert = this.alertCtrl.create({
        title: 'Sports Argument',
        message: 'Users have been added!',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
    }
  }

  toggleUser(userKey) {
    if (this.selectedUsers.indexOf(userKey) > -1) {
      this.selectedUsers.splice(this.selectedUsers.indexOf(userKey));
    } else {
      this.selectedUsers.push(userKey);
    }
  }
}
