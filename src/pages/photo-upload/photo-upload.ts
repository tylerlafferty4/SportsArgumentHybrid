import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';

@Component({
  selector: 'page-photo-upload',
  templateUrl: 'photo-upload.html',
})
export class PhotoUploadPage {

  captureDataUrl: string;
  photoref = firebase.database().ref('photos/');
  user = firebase.auth().currentUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoUploadPage');
  }

  capture() {
    const cameraOptions: CameraOptions = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      // Handle error
    });
  }

  upload() {
    let loading = this.loadingCtrl.create({
      content: 'Upload photo'
    });
    loading.present();
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`photoWall/${filename}.jpg`);

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      loading.dismiss();
      this.uploadToDatabase(snapshot);
    });
  }

  uploadToDatabase(snapshot) {
    firebase.database().ref('photos/').push({
      img: snapshot.downloadURL,
      authorUID: this.user.uid,
      author: this.user.displayName,
      likes: 0,
      commentCount: 0,
      uploadDate: Date()
    });
    
    let alert = this.alertCtrl.create({
      title: 'Sports Argument',
      message: 'Image has been added',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: data => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
    this.captureDataUrl = "";
  }
}
