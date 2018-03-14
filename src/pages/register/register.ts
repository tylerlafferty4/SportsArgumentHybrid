import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { LockerRoomsPage } from '../locker-rooms/locker-rooms';
import { User } from '@firebase/auth-types';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public signupForm: FormGroup;
  public loading: Loading;

  ref = firebase.database().ref('displayNames/');

  constructor(
    public navCtrl: NavController, 
    // public authProvider: AuthProvider,
    public formBuilder: FormBuilder, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private storage: Storage
  ) {
      this.signupForm = formBuilder.group({
        email: ['', 
          Validators.compose([Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
        displayName:  ['', Validators.required],
        password: ['', 
          Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }

  async signupUser() {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        this.signupForm.value.email,
        this.signupForm.value.password
      );
      if (result) {
        let user:User = firebase.auth().currentUser;
        user.updateProfile({
          displayName: this.signupForm.value.displayName,
          photoURL: ''
        });
           user.sendEmailVerification().then(
             (success) => {
               console.log("please verify your email")
               
              //  let newData = this.ref.push();
              //  newData.set({
              //    displayName: this.signupForm.value.displayName
              //  });
               let alert = this.alertCtrl.create({
                title: 'Sports Argument',
                message: 'Please verify your email address before logging in.',
                buttons: [{
                  text: 'Ok',
                  role: 'cancel',
                  handler: data => {
        
                  }
                }]
              });
              alert.present();
              } 
           ).catch(
             (err) => {
               // this.error = err;
             }
           )
        this.navCtrl.pop();
      }
    } catch (e) {
      let alert = this.alertCtrl.create({
        title: 'Sports Argument',
        message: 'Error occurred during registration. Please try again later.',
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
