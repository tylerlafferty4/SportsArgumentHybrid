import { AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { WordPressService } from '../../services/word-press/word-press.service';
import { Observable } from "rxjs/Observable";
import { InAppBrowser } from '@ionic-native/in-app-browser';
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
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private wordPressService: WordPressService,
    private iab: InAppBrowser
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

    let alert = this.alertCtrl.create({
      title: 'Add a comment',
      message: 'Comments on Mobile is not currently supported, but coming very soon!',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: data => {
            console.log('Okay clicked');
          }
        },
        {
          text: 'Comment online?',
          handler: data => {
            this.iab.create(this.post.link + '#respond', '_blank');
          }
        }
      ]
    });
    alert.present();
  }
}
    // let user: any;

    // this.authenticationService.getUser()
    // .then(res => {
    //   user = res;

    //   let alert = this.alertCtrl.create({
    //   title: 'Add a comment',
    //   inputs: [
    //     {
    //       name: 'comment',
    //       placeholder: 'Comment'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Accept',
    //       handler: data => {
    //         let loading = this.loadingCtrl.create();
    //         loading.present();
    //         this.wordPressService.createComment(this.post.id, user, data.comment)
    //         .subscribe(
    //           (data) => {
    //             console.log("ok", data);
    //             this.getComments();
    //             loading.dismiss();
    //           },
    //           (err) => {
    //             console.log("err", err);
    //             loading.dismiss();
    //           }
    //         );
    //       }
    //     }
    //   ]
    // });
    // alert.present();
    // },
    // err => {
    //   let alert = this.alertCtrl.create({
    //     title: 'Please login',
    //     message: 'You need to login in order to comment',
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('Cancel clicked');
    //         }
    //       },
    //       {
    //         text: 'Login',
    //         handler: () => {
    //           this.navCtrl.push(LoginPage);
    //         }
    //       }
    //     ]
    //   });
    // alert.present();
    // });



