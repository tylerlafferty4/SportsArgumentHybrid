import { Component } from '@angular/core';
import moment from 'moment';
import { ActionSheetController, AlertController, NavController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PhotoUploadPage } from '../photo-upload/photo-upload';
import { PhotoCommentPage } from '../photo-comment/photo-comment';

@Component({
  selector: 'page-photo-wall',
  templateUrl: 'photo-wall.html',
})
export class PhotoWallPage {

  user = firebase.auth().currentUser;
  photos = [];
  photoref = firebase.database().ref('photos/');

  constructor(
    public navCtrl: NavController,
    private socialSharing: SocialSharing,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {

  }

  ionViewDidEnter() {
    this.user = firebase.auth().currentUser;
    this.getPhotos();
  }

  getPhotos(refresher?) {
    this.photoref.once('value', resp => {
      this.photos = [];
      this.photos = snapshotToArray(resp);
      this.photos.reverse();
      this.getTimeDifference();
      if (refresher) {
        refresher.complete();
      }
    }).catch(() => {
      let toast = this.toastCtrl.create({
        message: 'An error occurred getting new photos.',
        position: 'bottom',
        duration: 3000
      })
      toast.present();
      if (refresher) {
        refresher.complete();
      }
    });
  }

  doRefresh(refresher) {
    this.getPhotos(refresher);
  }

  tappedPhotoOptions(photo) {
    let alert = this.actionSheetCtrl.create({
      title: 'Sports Argument',
      buttons: [
        {
          text: 'Flag Photo',
          handler: () => {
            this.flagPhoto(photo);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  flagPhoto(photo) {
    let sendDate = moment(Date()).format('M/D/YYYY, h:mm:ss a z');
    firebase.database().ref('flaggedPhotos/').push({
      photokey: photo.key,
      user: photo.author,
      userId: photo.authorUID,
      uploadDate: photo.uploadDate,
      flaggedDate: sendDate
    });
    this.showFlagConfirm();
  }

  showFlagConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Sports Argument',
      message: 'Your request has been received. We will review and take action within 24 hours.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  getTimeDifference() {
    for (let photo of this.photos) {
      photo.time = moment(photo.uploadDate).fromNow();
    }
  }

  capture() {
    this.navCtrl.push(PhotoUploadPage);
  }

  likePhoto(photo) {
    if (firebase.auth().currentUser) {
      if (this.checkUserLiked(photo)) {
        console.log('Already liked');
      } else {
        var data = {
          img: photo.img,
          authorUID: photo.authorUID,
          author: photo.author,
          likes: photo.likes+1,
          comments: photo.comments,
          uploadDate: photo.uploadDate,
          commentCount: photo.commentCount
        }
        var updates = {};
        updates[photo.key] = data;
        this.photoref.update(updates);

        var dataUser = {
          userId: this.user.uid,
          displayName: this.user.displayName
        };
        var usersLiked = {};
        usersLiked[this.user.uid] = dataUser;
        firebase.database().ref('photos/'+photo.key+'/usersLiked/').update(usersLiked);
        photo.likes = photo.likes+1;
      }
    } else {
      let alert = this.alertCtrl.create({
        title: 'Sports Argument',
        message: 'You must be logged in to like a photo. Please go to the Locker Rooms page to login.',
        buttons: [{ text: 'Ok' }]
      });
      alert.present();
    }
  }

  checkUserLiked(photo): boolean {
    var usersLiked = [];
    firebase.database().ref('photos/'+photo.key+'/usersLiked').on('value', resp => {
      usersLiked = snapshotToArray(resp);
    });
    if (usersLiked) {
      for (let user of usersLiked) {
        if (user.key === this.user.uid) {
          return true;
        }
      }
    }
    return false;
  }

  commentPhoto(photo) {
    if (firebase.auth().currentUser) {
      this.navCtrl.push(PhotoCommentPage, {
        photo: photo
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Sports Argument',
        message: 'You must be logged in to view comments. Please go to the Locker Rooms page to login.',
        buttons: [{ text: 'Ok' }]
      });
      alert.present();
    }
  }

  sharePhoto(photo) {
    this.socialSharing.share('Photo from Sports Argument app', '', photo.img).then(() => {

    }).catch(() => {
      this.showErrorAlert();
    })
  }

  setupAlert(platform) {
    let alert = this.alertCtrl.create({
      title: 'Sports Argument',
      message: 'Please setup your '+platform+' account first on your device.',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  showErrorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Sports Argument',
      message: 'An error occurred sharing. Please try again later.',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }
}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
