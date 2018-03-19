import { Component } from '@angular/core';
import { LockerRoomsPage } from '../locker-rooms/locker-rooms';
import { RegisterPage } from '../register/register'
import { AlertController, NavParams, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { AD_MOB_SHOW_ADS, AD_MOB_AUTO_SHOW, AD_MOB_ID, AD_MOB_TESTING } from '../../config/ad-mob-config';

export interface User {
  email: string;
  password: string;
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user = {} as User;
  agreement = false;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private alertCtrl: AlertController,
    public facebook: Facebook,
    private adMob: AdMobFree
  ) {
    this.storage.get('userEmail').then((val) => {
      if (val) {
        this.navCtrl.setRoot(LockerRoomsPage);
      }
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
 
  async login(user: User) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {
        console.log('Result -> ' + JSON.stringify(result));
        if (result.emailVerified) {
          this.storage.set('userEmail', user.email);
          this.navCtrl.setRoot(LockerRoomsPage);
        } else {
          let alert = this.alertCtrl.create({
            title: 'Sports Argument',
            message: 'You must verify your email address before logging in.',
            buttons: [{
              text: 'Ok',
              role: 'cancel',
              handler: data => {
    
              }
            }]
          });
          alert.present();
        }
      }  
    }
    catch (e) {
      this.presentError(user, 'Login');
    }
  }

  facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
    .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then( success => { 
          console.log("Firebase success: " + JSON.stringify(success)); 
          // this.storage.set('userEmail', user.email);
          let display = firebase.auth().currentUser.displayName;
          if (display === null || display === '') {
            this.presentDisplayPrompt();
          } else {
            this.navCtrl.setRoot(LockerRoomsPage);
          }
        });

    }).catch((error) => { console.log(error) });
  }
 
  register() {
    this.navCtrl.push(RegisterPage);
  }

  presentDisplayPrompt() {
    let user = firebase.auth().currentUser;
    let alert = this.alertCtrl.create({
      title: 'Please enter a nickname',
      inputs: [
        {
          name: 'nickname',
          placeholder: 'Nickname'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            user.updateProfile({
              displayName: data.nickname,
              photoURL: ''
            });
          }
        }
      ]
    });
    alert.present();
  }

  presentError(user: User, failed: string) {
    var message: string = '';
      if (!user.email) {
        message = failed + ' failed. Please enter a valid email address.';
      } else if (!user.password) {
        message = failed + ' failed. Please enter a valid password.';
      } else {
        message = 'Error occurred. Please try again later.'
      }
      let alert = this.alertCtrl.create({
        title: 'Sports Argument',
        message: message,
        buttons: [{
          text: 'Ok',
          role: 'cancel',
          handler: data => {

          }
        }]
      });
      alert.present();
  }
}