import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { LockerRoomsPage } from '../locker-rooms/locker-rooms';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public signupForm: FormGroup;
  public loading: Loading;
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
        let user:any = firebase.auth().currentUser;
           user.sendEmailVerification().then(
             (success) => {console.log("please verify your email")} 
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
