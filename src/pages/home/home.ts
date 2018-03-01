import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { PostDetail } from '../post-detail/post-detail';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
	url: string = 'http://www.sportsargument.com/wp-json/wp/v2/posts';
	items: any;

	constructor( public navCtrl: NavController, private http: Http, public loadingCtrl: LoadingController ) {
		this.getItems();
	}

	ionViewDidEnter() {
		
	}

	getItems() {
		let loader = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Loading posts'
		});
		loader.present();
		this.http.get( this.url )
	    .map(res => res.json())
	    .subscribe(data => {
	      // we've got back the raw data, now generate the core schedule data
	      // and save the data for later reference
				this.items = data;
				loader.dismiss();
		});
	}
	
	doRefresh(refresher) {
    console.log('Begin async operation', refresher);
		this.http.get( this.url )
	    .map(res => res.json())
	    .subscribe(data => {
				this.items = data;
				refresher.complete();
		});
  }
  
  itemTapped(event, item) {
		this.navCtrl.push(PostDetail, {
		  item: item
		});
	}
}