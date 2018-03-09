import { Component } from '@angular/core';
import { LockerRoomsPage } from '../locker-rooms/locker-rooms';
import { RegisterPage } from '../register/register'
import { AlertController, NavParams, NavController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WordPressService } from '../../services/word-press/word-press.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';

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

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private alertCtrl: AlertController,
    public facebook: Facebook
  ) {
    this.storage.get('userEmail').then((val) => {
      if (val) {
        this.navCtrl.setRoot(LockerRoomsPage);
      }
  });
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
          this.navCtrl.setRoot(LockerRoomsPage);
        });

    }).catch((error) => { console.log(error) });
  }
 
  register() {
    this.navCtrl.push(RegisterPage);
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