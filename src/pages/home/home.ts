import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { PostDetail } from '../post-detail/post-detail';
import { WordPressService } from '../../services/word-press/word-press.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
	url: string = 'http://www.sportsargument.com/wp-json/wp/v2/posts';
	posts: any;
	public morePagesAvailable;

	constructor( public navCtrl: NavController, private wordPressService: WordPressService, public loadingCtrl: LoadingController ) {
		this.getItems();
	}

	ionViewDidLoad() {
		this.morePagesAvailable = true;
	}

	getItems() {
		let loader = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Loading posts'
		});
		loader.present();
		// this.http.get( this.url )
	  //   .map(res => res.json())
	  //   .subscribe(data => {
	  //     // we've got back the raw data, now generate the core schedule data
	  //     // and save the data for later reference
		// 		this.items = data;
		// 		loader.dismiss();
		// });
		this.wordPressService.getRecentPosts().subscribe(data => {
			this.posts = data;
			loader.dismiss();
		});
	}

	doInfinite(infiniteScroll) {
		let page = (Math.ceil(this.posts.length/10)) + 1;
		let loading = true;
	
		this.wordPressService.getRecentPosts(page)
		.subscribe(data => {
			for(let post of data) {
				if(!loading){
					infiniteScroll.complete();
					}
				post.excerpt.rendered = post.excerpt.rendered.split('<a')[0];
				this.posts.push(post);
				loading = false;
				}
			}, err => {
			this.morePagesAvailable = false;
			})
		}
	
	doRefresh(refresher) {
    console.log('Begin async operation', refresher);
		// this.http.get( this.url )
	  //   .map(res => res.json())
	  //   .subscribe(data => {
		// 		this.items = data;
		// 		refresher.complete();
		// });
		this.wordPressService.getRecentPosts().subscribe(data => {
			this.posts = data;
			refresher.complete();
		});
  }
  
  itemTapped(event, post) {
		this.navCtrl.push(PostDetail, {
		  item: post
		});
	}
}