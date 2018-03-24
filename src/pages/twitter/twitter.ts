import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { AD_MOB_SHOW_ADS, AD_MOB_AUTO_SHOW, AD_MOB_ID, AD_MOB_TESTING } from '../../config/ad-mob-config';

@Component({
  selector: 'twitter-page',
  templateUrl: 'twitter.html'
})
export class TwitterPage {

  constructor(public navCtrl: NavController, private adMob: AdMobFree) {
    if (AD_MOB_SHOW_ADS) {
      this.showBannerAd();
    }
  }

  ionViewDidEnter() {
    if (AD_MOB_SHOW_ADS) {
			this.adMob.banner.show();
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
