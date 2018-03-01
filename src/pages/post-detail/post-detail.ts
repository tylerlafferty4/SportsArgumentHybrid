import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { WordPressService } from '../../services/word-press/word-press.service';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'post-detail',
  templateUrl: 'post-detail.html'
})
export class PostDetail {
  post: any;
  user: string;
  comments: Array<any> = new Array<any>();
  categories: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;

  constructor(
    private nav: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private wordPressService: WordPressService
  ) {
    // If we navigated to this page, we will have an item available as a nav param
    // this.selectedItem = navParams.get('item');
  }

  ionViewWillEnter(){
    this.morePagesAvailable = true;
    let loading = this.loadingCtrl.create();
  
    loading.present();
  
    this.post = this.navParams.get('item');
  
    Observable.forkJoin(
      this.getAuthorData(),
      this.getComments())
      .subscribe(data => {
        this.user = data[0].name;
        this.comments = data[1];
        loading.dismiss();
      });
  }
  
  getAuthorData(){
    return this.wordPressService.getAuthor(this.post.author);
  }
  
  getComments(){
    return this.wordPressService.getComments(this.post.id);
  }

  loadMoreComments(infiniteScroll) {
    let page = (this.comments.length/10) + 1;
    this.wordPressService.getComments(this.post.id, page)
    .subscribe(data => {
      for(let item of data){
        this.comments.push(item);
      }
      infiniteScroll.complete();
    }, err => {
      console.log(err);
      this.morePagesAvailable = false;
    })
  }

  createComment() {

  }
}



