import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PostDetail } from '../post-detail/post-detail';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
	url: string = 'http://www.sportsargument.com/wp-json/wp/v2/posts';
	items: any;

	constructor( public navCtrl: NavController, private http: Http ) {}

	ionViewDidEnter() {
		this.http.get( this.url )
	    .map(res => res.json())
	    .subscribe(data => {
	      // we've got back the raw data, now generate the core schedule data
	      // and save the data for later reference
	      this.items = data;
      });
  }
  
  itemTapped(event, item) {
		this.navCtrl.push(PostDetail, {
		  item: item
		});
	}
}