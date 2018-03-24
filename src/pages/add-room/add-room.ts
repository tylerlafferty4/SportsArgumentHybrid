import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Alert } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {

  data = { roomname:'', privateRoom:false };
  ref = firebase.database().ref('chatrooms/');
  privateRef = firebase.database().ref('privaterooms/');

  user = firebase.auth().currentUser;

  privateRoom = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoomPage');
  }

  addRoom() {
    if (this.data.roomname === '') {
      let alert = this.alertCtrl.create({
        title: 'Sports Argument',
        message: 'You must set a Room Name',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: data => {

            }
          }
        ]
      });
      alert.present();
    } else {
      if (this.data.privateRoom) {
        let newData = this.privateRef.push();
        newData.set({
          private: true,
          roomname: this.data.roomname,
          owner: this.user.email
        });
      } else {
        let newData = this.ref.push();
        newData.set({
          roomname:this.data.roomname
        });
      }
      
      this.navCtrl.pop();
    }
  }

  togglePrivate() {
    this.privateRoom = !this.privateRoom;
  }
}
