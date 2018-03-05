import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser, ThemeableBrowserObject, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';

@Component({
  selector: 'locker-rooms-page',
  templateUrl: 'locker-rooms.html'
})
export class LockerRoomsPage {

  //  public readyUI: ReadyUI;

  private options: ThemeableBrowserOptions = {
    statusbar: {
        color: '#ffffffff'
    },
    toolbar: {
        height: 44,
        color: '#f0f0f0ff'
    },
    title: {
        color: '#003264ff',
        showPageTitle: true
    },
    backButton: {
        image: 'back',
        imagePressed: 'back_pressed',
        align: 'left',
        event: 'backPressed'
    },
    forwardButton: {
        image: 'forward',
        imagePressed: 'forward_pressed',
        align: 'left',
        event: 'forwardPressed'
    },
    closeButton: {
        image: 'close',
        imagePressed: 'close_pressed',
        align: 'left',
        event: 'closePressed'
    },
    customButtons: [
        {
            image: 'share',
            imagePressed: 'share_pressed',
            align: 'right',
            event: 'sharePressed'
        }
    ],
    menu: {
        image: 'menu',
        imagePressed: 'menu_pressed',
        title: 'Test',
        cancel: 'Cancel',
        align: 'right',
        items: [
            {
                event: 'helloPressed',
                label: 'Hello World!'
            },
            {
                event: 'testPressed',
                label: 'Test!'
            }
        ]
    },
    backButtonCanClose: true
};

  public url: string = 'http://sportsargument.com/login';
  
  constructor(
    public navCtrl: NavController,
    private iab: InAppBrowser,
    private tb: ThemeableBrowser
  ) {

  }

  // public browser = this.iab.create('https://ionicframework.com/');

  
  ionViewDidLoad() {
    // ReadyUI.setUrl("http://www.sportsargument.com/cometchat/");
    // CCCometChat.initializeCometChat("http://www.sportsargument.com/cometchat/", "U7BJC-7VWFL-CF3JE-BFEL4-VT5WT", apiKey, "NO", this.successCallback(response){}, this.failCallback(response){});
    // this.readyUI.loginWithUsername("John","passw0rd", this.callbackmeth);
    // this.tb.create('https://ionicframework.com/');

    // this.iab.create('http://sportsargument.com/login/?redirect_to=http://sportsargument.com/redirector');
    // this.iab.
    // const browser: ThemeableBrowserObject = this.tb.create('https://ionicframework.com/', '_blank', this.options);
  }

    closeInAppBrowser(event) {
        if (event.url.match("/close")) {

        }
}

  successCallback(result){
            
    alert(result);
            
  }

}
