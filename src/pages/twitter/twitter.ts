import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'twitter-page',
  templateUrl: 'twitter.html'
})
export class TwitterPage {

  constructor(public navCtrl: NavController) {

  }

  ngAfterViewInit() {
    !function(d,s,id){
      var js: any,
          fjs=d.getElementsByTagName(s)[0],
          p='https';
          js=d.createElement(s);
          js.id=id;
          js.src=p+"://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js,fjs);
    }
    (document,"script","twitter-wjs");
  }

}
