import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WordPressService } from '../../services/word-press/word-press.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  register_form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public wordpressService: WordPressService,
    public authenticationService: AuthenticationService
  ) {}

  ionViewWillLoad() {
    this.register_form = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
  }

  onSubmit(values){
    // var username: 'Sportsarguments'; // this should be an administrator Username
    // var password: 'Crede24!'; // this should be an administrator Password
    // //only authenticated administrators can create users
    // this.authenticationService.doLogin(username, password)
    // .subscribe(
    //   res => {
    //     let user_data = {
    //       username: values.username,
    //       name: values.displayName,
    //       email: values.email,
    //       password: values.password
    //     };
    //     this.authenticationService.doRegister(user_data, res.json().token)
    //     .subscribe(
    //       result => {
    //         console.log('Success -> ' + result);
    //       },
    //       error => {
    //         console.log('Error -> ' + error);
    //       }
    //     );
     // },
    //   err => {
    //     console.log('Err -> ' + err);
    //   }
   // )
  }

}