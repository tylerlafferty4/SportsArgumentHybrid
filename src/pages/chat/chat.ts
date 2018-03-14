import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { LockerRoomsPage } from '../locker-rooms/locker-rooms';
import * as firebase from 'firebase'
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;

  data = { type:'', nickname:'', message:'' };
  chats = [];
  roomkey: string;
  roomName: string;
  nickname: string;
  offStatus: boolean = false;

  user = firebase.auth().currentUser;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.roomkey = this.navParams.get('key');
    this.roomName = this.navParams.get('roomName');
    let temp = this.navParams.get('nickname');
    // let split = this.nickname.split("@", 2);
    this.nickname = this.user.displayName;
    this.data.type = 'message';
    this.data.nickname = this.nickname;
  
    // let joinData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    // joinData.set({
    //   type:'join',
    //   user:this.nickname,
    //   message:this.nickname+' has joined this room.',
    //   sendDate:Date()
    // });
    // this.data.message = '';
  
    firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
    });
  }

  sendMessage() {
    let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    newData.set({
      type: this.data.type,
      user: this.data.nickname,
      message: this.data.message,
      sendDate: Date()
    });
    this.data.message = '';
  }

  exitChat() {
    // let exitData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    // exitData.set({
    //   type:'exit',
    //   user:this.nickname,
    //   message:this.nickname+' has exited this room.',
    //   sendDate:Date()
    // });
  
    this.offStatus = true;
  
    this.navCtrl.setRoot(LockerRoomsPage, {
      nickname:this.nickname
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

