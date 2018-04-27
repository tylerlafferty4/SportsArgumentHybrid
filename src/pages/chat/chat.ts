import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams, Content, ToastController } from 'ionic-angular';
import * as firebase from 'firebase'
import { FCM } from '@ionic-native/fcm';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import moment from 'moment';
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
  isPrivate: boolean;
  isEditing = false;
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
    this.isPrivate = this.navParams.get('isPrivate');
    // let temp = this.navParams.get('nickname');
    // let split = this.nickname.split("@", 2);
    this.nickname = this.user.displayName;
    this.data.type = 'message';
    this.data.nickname = this.nickname;
  
    if (this.isPrivate) {
      firebase.database().ref('privaterooms/'+this.roomkey+'/chats').on('value', resp => {
        this.chats = [];
        this.chats = snapshotToArray(resp);
        this.getTimeDifference();
        setTimeout(() => {
          if(this.offStatus === false) {
            this.content.scrollToBottom(300);
          }
        }, 1000);
      });
    } else {
      firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
        this.chats = [];
        this.chats = snapshotToArray(resp);
        this.getTimeDifference();
        setTimeout(() => {
          if(this.offStatus === false) {
            this.content.scrollToBottom(300);
          }
        }, 1000);
      });
    }
    // if (AD_MOB_SHOW_ADS) {
    //   this.showBannerAd();
    // }
    if (AD_MOB_SHOW_ADS) {
      this.adMob.banner.hide();
    }
  }

  getTimeDifference() {
    for (let chat of this.chats) {
      chat.time = moment(chat.sendDate).fromNow();
      // const now = moment();
      // const upload = moment(chat.sendDate);
      // const hours = now.diff(upload, 'hours');
      // const minutes = now.diff(upload, 'minutes');
      // if (hours > 23) {
      //   const days = now.diff(upload, 'days');
      //   if (days === 1) {
      //     chat.time = days + ' day ago';
      //   } else {
      //     chat.time = days + ' days ago';
      //   }
      // } else if (minutes > 60) {
      //   if (hours === 1) {
      //     chat.time = hours + ' hour ago';
      //   } else {
      //     chat.time = hours + ' hours ago';
      //   }
      // } else {
      //   if (minutes === 1) {
      //     chat.time = minutes + ' minute ago';
      //   } else if (minutes < 1) {
      //     chat.time = 'a few seconds ago';
      //   } else {
      //     chat.time = minutes + ' minutes ago';
      //   }
      // }
    }
  }

  ionViewDidEnter() {
    if (AD_MOB_SHOW_ADS) {
      this.adMob.banner.hide();
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
      var newData: any;
      console.log('Private -> ' + this.isPrivate);
      
      if (this.isPrivate) {
        newData = firebase.database().ref('privaterooms/'+this.roomkey+'/chats').push();
      } else {
        newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
      }
      let sendDate = moment(Date()).format('M/D/YYYY, h:mm:ss a z');
      newData.set({
        type: this.data.type,
        user: this.user.displayName,
        userId: this.user.uid,
        email: this.user.email,
        message: this.data.message,
        sendDate: sendDate
      });
      if (!this.isPrivate) {
        this.updateMessageCount();
      }
      this.fcm.subscribeToTopic(this.roomkey);
      this.sendMessageNotification();
      this.data.message = '';
    }
  }

  updateMessageCount() {
    let sendDate = moment(Date()).format('M/D/YYYY, h:mm:ss a z');
    let newData = firebase.database().ref('chatrooms/'+this.roomkey).push().key;
    var dataCount = {
      messageCount: this.chats.length,
      dateSent: sendDate
    };
    var updates = {};
    updates['infoUpdate'] = dataCount;
    firebase.database().ref('chatrooms/'+this.roomkey).update(updates);
  }

  sendMessageNotification() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', 'key=AAAAF_AqS7k:APA91bEBZVElYXp2zcLdatVQ9_aQQ6xgrXEXvBKPA3zi5pXIdxRtj_5YGsiBESZ4Jw_1dopSPI9SQci2T1km_4kse47RGZncPTpARkREolM4EHTTQLf6K2aA8e1ly3kzI0ljAW1leBQE')

    let body = {
      to: '/topics/'+this.roomkey,
      priority: 'high',
      notification: {
        body: 'There is a new message in '+this.roomName,
        title: 'New Message',
        badge: '1'
      },
      data: {
        roomkey: this.roomkey
      }
    }
    console.log('Sending notification');
    this.http.post('https://fcm.googleapis.com/fcm/send', JSON.stringify(body), {headers: headers})
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

  tappedMyMessage(chat) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sports Argument',
      buttons: [
        // {
        //   text: 'Edit Message',
        //   handler: () => {
        //     this.editMessage(chat);
        //   }
        // },
        {
          text: 'Delete Message',
          handler: () => {
            this.deleteMessage(chat);
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
  
  deleteMessage(chat) {
    if (this.isPrivate) {
      firebase.database().ref('privaterooms/'+this.roomkey+'/chats/'+chat.key).remove();
    } else {
      firebase.database().ref('chatrooms/'+this.roomkey+'/chats/'+chat.key).remove();
    }
  }

  editMessage(chat) {
    this.isEditing = true;
    this.data.message = chat.message;
  }
 
  flagMessage(chat) {
    let sendDate = moment(Date()).format('M/D/YYYY, h:mm:ss a z');
    let newData = this.flaggedMessages.push();
    newData.set({
      roomkey: this.roomkey,
      roomname: this.roomName,
      messageUser: chat.user,
      message: chat.message,
      dateSent: chat.sendDate,
      flaggedDate: sendDate
    });
    this.showFlagConfirm();
  }

  flagUser(chat) {
    let sendDate = moment(Date()).format('M/D/YYYY, h:mm:ss a z');
    if (chat.email) {
      let newData = this.flaggedUsers.push();
        newData.set({
          user: chat.user,
          email: chat.email,
          flaggedDate: sendDate
        });
    } else {
      let newData = this.flaggedUsers.push();
      newData.set({
        user: chat.user,
        flaggedDate: sendDate
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

