import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams, Content, ToastController } from 'ionic-angular';
import * as firebase from 'firebase'
import { FCM } from '@ionic-native/fcm';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { AD_MOB_SHOW_ADS, AD_MOB_AUTO_SHOW, AD_MOB_ID, AD_MOB_TESTING } from '../../config/ad-mob-config';

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

  flaggedUsers = firebase.database().ref('flaggedUsers/');
  flaggedMessages = firebase.database().ref('flaggedMessages/');

  profantiy = ['fuck', 'shit', 'bitch'];

  subscribed = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fcm: FCM,
    private toastCtrl: ToastController,
    private http: Http,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private adMob: AdMobFree
  ) {
    
    this.roomkey = this.navParams.get('key');
    this.roomName = this.navParams.get('roomName');
    // let temp = this.navParams.get('nickname');
    // let split = this.nickname.split("@", 2);
    this.nickname = this.user.displayName;
    this.data.type = 'message';
    this.data.nickname = this.nickname;
  
    firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
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

  toggleSubscribe() {
    // let room = this.roomName.replace(/\s/g, '');
    if (this.subscribed) {
      let toast = this.toastCtrl.create({
        message: 'Subscribing to Topic',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.fcm.subscribeToTopic(this.roomkey);
    } else {
      this.fcm.unsubscribeFromTopic(this.roomkey);
    }
  }

  sendMessage() {
    var containsProfanity = false;
    for(let i=0; i<this.profantiy.length; i++) {
      let prof = this.profantiy[i];
      if (this.data.message.includes(prof)){
        containsProfanity = true;
      }
    }
    if (containsProfanity) {
      // Message contained profanity. Don't send the message.
      let alert = this.alertCtrl.create({
        title: 'Sports Argument',
        message: 'Profanity is not permitted. Please edit your message and try again.',
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
      let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
      newData.set({
        type: this.data.type,
        user: this.data.nickname,
        email: this.user.email,
        message: this.data.message,
        sendDate: Date()
      });
      this.sendMessageNotification();
      this.data.message = '';
    }
  }

  sendMessageNotification() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', 'key=AAAAF_AqS7k:APA91bEBZVElYXp2zcLdatVQ9_aQQ6xgrXEXvBKPA3zi5pXIdxRtj_5YGsiBESZ4Jw_1dopSPI9SQci2T1km_4kse47RGZncPTpARkREolM4EHTTQLf6K2aA8e1ly3kzI0ljAW1leBQE')

    let body = {
      to: '/topics/'+this.roomkey,
      body: 'New Message',
      title: 'There is a new message in '+this.roomName,
      priority: 'high'
    }

    console.log('Sending notification');
    this.http.post('https://fcm.googleapis.com/fcm/send', JSON.stringify(body), {headers: headers})
    // .then(data => {
    //   console.log('Request success -> ' + data.data);
    // })
    // .catch(error => {
    //   console.log('Request failed -> ' + error.status);
    // });
      .map(res => {
        console.log('Response -> ' + res.json())
      })
      .subscribe(data => {
        console.log('Push Complete -> ' + data);
      });
  }

  tappedMessage(chat) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sports Argument',
      buttons: [
        {
          text: 'Flag Message',
          handler: () => {
            this.flagMessage(chat);
          }
        },
        {
          text: 'Flag User',
          handler: () => {
            this.flagUser(chat);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  flagMessage(chat) {
    let newData = this.flaggedMessages.push();
    newData.set({
      roomkey: this.roomkey,
      roomname: this.roomName,
      messageUser: chat.user,
      message: chat.message,
      dateSent: chat.sendDate,
      flaggedDate: Date()
    });
    this.showFlagConfirm();
  }

  flagUser(chat) {
    if (chat.email) {
      let newData = this.flaggedUsers.push();
        newData.set({
          user: chat.user,
          email: chat.email,
          flaggedDate: Date()
        });
    } else {
      let newData = this.flaggedUsers.push();
      newData.set({
        user: chat.user,
        flaggedDate: Date()
      });
    }
    this.showFlagConfirm();
  }
  
  showFlagConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Sports Argument',
      message: 'Your request has been received. We will review and take action within 24 hours.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    alert.present();
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

