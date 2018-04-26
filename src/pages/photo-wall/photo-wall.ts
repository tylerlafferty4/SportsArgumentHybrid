import { Component } from '@angular/core';
import moment from 'moment';
import { AlertController, NavController } from 'ionic-angular';
import * as firebase from 'firebase';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PhotoUploadPage } from '../photo-upload/photo-upload';

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
    private alertCtrl: AlertController
  ) {
    this.getPhotos();
  }

  getPhotos() {
    this.photoref.on('value', resp => {
      this.photos = [];
      this.photos = snapshotToArray(resp);
      this.photos.reverse();
      this.getTimeDifference();
    });
  }

  getTimeDifference() {
    for (let photo of this.photos) {
      // var diff = Math.abs(Date.now() - new Date(photo.uploadDate).getTime());
      // var diffDays = diff / (1000 * 3600 * 24); 
      // var time = Date.now() - new Date(photo.uploadDate).getTime();
      const now = moment();
      const upload = moment(photo.uploadDate);
      const hours = now.diff(upload, 'hours');
      if (hours > 23) {
        const days = now.diff(upload, 'days');
        if (days === 1) {
          photo.time = days + ' day ago';
        } else {
          photo.time = days + ' days ago';
        }
      } else {
        if (hours === 1) {
          photo.time = hours + ' hour ago';
        } else {
          photo.time = hours + ' hours ago';
        }
      }
    }
  }

  capture() {
    this.navCtrl.push(PhotoUploadPage);
  }

  likePhoto(photo) {
    if (this.checkUserLiked(photo)) {
      console.log('Already liked');
    } else {
      var data = {
        img: photo.img,
        authorUID: photo.authorUID,
        author: photo.author,
        likes: photo.likes+1,
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
