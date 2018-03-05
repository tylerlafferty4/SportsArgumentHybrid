import { Component } from '@angular/core';
import { LockerRoomsPage } from '../locker-rooms/locker-rooms';
import { RegisterPage } from '../register/register'
import { NavController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WordPressService } from '../../services/word-press/word-press.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  platform: any;
  login_form: FormGroup;
  error_message: string;

  REDIRECT_URL: string = '?redirect_to=http://sportsargument.com/redirector';

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public wordpressService: WordPressService,
    public authenticationService: AuthenticationService,
    public iab: InAppBrowser
  ) {}

  signIn() {
    let url = 'http://sportsargument.com/login/' + this.REDIRECT_URL;
    console.log('URL -> ' + url);
    
    const browser = this.iab.create(url, '_blank');
    browser.show();
    console.log('Showing browser');
    
    browser.on("exit").subscribe(
      (event) => {
        this.navCtrl.setRoot(LockerRoomsPage);
      },
      (err) => {
          console.log("InAppBrowser Loadstop Event Error: " + err);
      }
     );
    }

  register() {

  }

  ionViewWillLoad() {
    // this.login_form = this.formBuilder.group({
    //   username: new FormControl('', Validators.compose([
    //     Validators.required
    //   ])),
    //   password: new FormControl('', Validators.required)
    // });
  }

  login(value){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.authenticationService.doLogin(value.username, value.password)
    .subscribe(res => {
       this.authenticationService.setUser({
         token: res.json().token,
         username: value.username,
         displayname: res.json().user_display_name,
         email: res.json().user_email
       });

       loading.dismiss();
       this.navCtrl.setRoot(LockerRoomsPage);
     },
     err => {
       loading.dismiss();
       this.error_message = "Invalid credentials. Try with username 'aa' password 'aa'.";
       console.log('Err on login -> ' + err);
     })
  }

  skipLogin() {
    this.navCtrl.setRoot(LockerRoomsPage);
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }
}