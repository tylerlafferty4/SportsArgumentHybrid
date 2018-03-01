import { Component } from '@angular/core';
import { LockerRoomsPage } from '../locker-rooms/locker-rooms';
import { RegisterPage } from '../register/register'
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WordPressService } from '../../services/word-press/word-press.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  login_form: FormGroup;
  error_message: string;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public wordpressService: WordPressService,
    public authenticationService: AuthenticationService
  ) {}

  ionViewWillLoad() {
    this.login_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.required)
    });
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
       console.log(err);
     })
  }

  skipLogin(){
    this.navCtrl.setRoot(LockerRoomsPage);
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }
}