import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'locker-rooms-page',
  templateUrl: 'locker-rooms.html'
})
export class LockerRoomsPage {

  //  public readyUI: ReadyUI;

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    // ReadyUI.setUrl("http://www.sportsargument.com/cometchat/");
    // CCCometChat.initializeCometChat("http://www.sportsargument.com/cometchat/", "U7BJC-7VWFL-CF3JE-BFEL4-VT5WT", apiKey, "NO", this.successCallback(response){}, this.failCallback(response){});
    // this.readyUI.loginWithUsername("John","passw0rd", this.callbackmeth);
  }

  successCallback(result){
            
    alert(result);
            
  }

}
