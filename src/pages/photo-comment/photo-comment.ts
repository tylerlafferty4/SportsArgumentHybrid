import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import moment from 'moment';

@Component({
  selector: 'page-photo-comment',
  templateUrl: 'photo-comment.html',
})
export class PhotoCommentPage {

  selectedPhoto: any;
  comments = [];
  message = '';

  user = firebase.auth().currentUser;
  flaggedUsersRef = firebase.database().ref('flaggedUsers/');
  flaggedMessagesRef = firebase.database().ref('flaggedComments/');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {

      if (this.navParams.get('photo')) {
        this.selectedPhoto = this.navParams.get('photo');
      }

      firebase.database().ref('photos/'+this.selectedPhoto.key+'/comments').on('value', resp => {
        this.comments = [];
        this.comments = snapshotToArray(resp);
        this.getTimeDifference();
      });
  }

  sendComment() {
    // Update comment count
    var data = {
      author: this.selectedPhoto.author,
      authorUID: this.selectedPhoto.authorUID,
      img: this.selectedPhoto.img,
      likes: this.selectedPhoto.likes,
      comments: this.selectedPhoto.comments,
      usersLiked: this.selectedPhoto.usersLiked,
      commentCount: this.selectedPhoto.commentCount+1,
      uploadDate: this.selectedPhoto.uploadDate
    }
    var updates = {};
    updates[this.selectedPhoto.key] = data;
    firebase.database().ref('photos/').update(updates);

    // Add the comment to firebase
    let sendDate = moment(Date()).format('M/D/YYYY, h:mm:ss a z');
    firebase.database().ref('photos/'+this.selectedPhoto.key+'/comments').push({
      user: this.user.displayName,
      userId: this.user.uid,
      message: this.message,
      sendDate: sendDate
    });
    this.message = '';
    
  }

  tappedComment(comment) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sports Argument',
      buttons: [
        {
          text: 'Flag Comment',
          handler: () => {
            this.flagMessage(comment);
          }
        },
        {
          text: 'Flag User',
          handler: () => {
            this.flagUser(comment);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  tappedMyComment(comment) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sports Argument',
      buttons: [
        // {
        //   text: 'Edit Message',
        //   handler: () => {
        //     this.editMessage(chat);
        //   }
        // },
        {
          text: 'Delete Message',
          handler: () => {
            this.deleteMessage(comment);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  deleteMessage(comment) {
      firebase.database().ref('photos/'+this.selectedPhoto.key+'/comments/'+comment.key).remove();
  }

  editMessage(comment) {
   // this.isEditing = true;
    this.message = comment.message;
  }
 
  flagMessage(comment) {
    let sendDate = moment(Date()).format('M/D/YYYY, h:mm:ss a z');
    let newData = this.flaggedMessagesRef.push();
    newData.set({
      photokey: this.selectedPhoto.key,
      commenteUser: comment.user,
      comment: comment.message,
      dateSent: comment.sendDate,
      flaggedDate: sendDate
    });
    this.showFlagConfirm();
  }

  flagUser(comment) {
    let sendDate = moment(Date()).format('M/D/YYYY, h:mm:ss a z');
    if (comment.email) {
      let newData = this.flaggedUsersRef.push();
        newData.set({
          user: comment.user,
          email: comment.email,
          flaggedDate: sendDate
        });
    } else {
      let newData = this.flaggedUsersRef.push();
      newData.set({
        user: comment.user,
        flaggedDate: sendDate
      });
    }
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
    for (let comment of this.comments) {
      comment.time = moment(comment.sendDate).fromNow();
    }
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
