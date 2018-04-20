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

  curUser = firebase.auth().currentUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
  ) {
    this.roomKey = this.navParams.get('roomkey');
    firebase.database().ref('privaterooms/'+this.roomKey+'/users/').on('value', resp => {
      this.alreadyInUsers = [];
      this.alreadyInUsers = snapshotToArray(resp);
    });
    firebase.database().ref('users/').on('value', resp => {
      this.users = [];
      this.users = snapshotToArray(resp);
      // for (let user of this.users) {
      //   if (user.key === this.curUser.uid) {
      //     console.log('Found match -> ' + this.curUser.displayName);
      //     this.users.splice(this.users.indexOf(user.key));
      //   }
      // }
    });
  }

  determineAlreadyIn() {
    // console.log('Determining already in');
    // for(let user of this.alreadyInUsers) {
    //   console.log('Determining for -> ' + user.key);
    //   for (let newUser of this.users) {
    //     console.log('Comparing alreadyUser -> ' + user.key + ' to newUser -> ' + newUser.key);
    //     if (this.alreadyInUsers.indexOf(newUser) > -1) {
    //       console.log('FOUND A MATCH');
          
    //       this.users.splice(this.users.indexOf(newUser));
    //     }
    //   }
    // }
  }
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
      var dataUser: any;
      if (user.email && user.email !== '') {
        dataUser = {
          displayName: user.displayName,
          email: user.email
        };
      } else {
        dataUser = {
          displayName: user.displayName
        };
      }
      var updates = {};
      updates[user.key] = dataUser;
      firebase.database().ref('privaterooms/'+this.roomKey+'/users/').update(updates);
    }
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

  toggleUser(user) {
    if (this.selectedUsers.indexOf(user) > -1) {
      this.selectedUsers.splice(this.selectedUsers.indexOf(user));
    } else {
      this.selectedUsers.push(user);
    }
  }
}
