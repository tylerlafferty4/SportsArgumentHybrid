import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

@Component({
  selector: 'podcasts-page',
  templateUrl: 'podcasts.html'
})
export class PodcastsPage {

    videosId: string = 'videos';
    dateUpdate: string = 'dateLastUpdated';

    channelID: string = 'UC1egVmcqGXQv2tgdiy0ajHA';
    maxResults: string = '10';
    googleToken: string = 'AIzaSyBK4TGpJZ-fOsmG1BqIOb8CP_lBox9k6o0';
    searchQuery: string = '';
    posts: any[] = [];
    onPlaying: boolean = false; 
  
    constructor(
        public http: Http, 
        public nav:NavController,
        private storage: Storage,
        private youtube: YoutubeVideoPlayer
    ) {
        let url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=' + this.channelID + '&q=' + this.searchQuery + '&type=video&order=date&maxResults=' + this.maxResults + '&key=' + this.googleToken;
  
        
        storage.get(this.videosId).then((val) => {
            storage.get(this.dateUpdate).then((dateVal) => {
                // if (dateVal) {
                //     var dateNow = new Date();
                //     var diff = Math.abs(dateVal.getTime() - dateNow.getTime());
                //     var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
                //     if (diffDays > 7) {
                //         val = null;
                //     }
                // }
                if (val == null) {
                    console.log('Getting videos');
                    // let toast = this.toastCtrl.create({
                    //     message: 'Getting Videos',
                    //     duration: 3000,
                    //     position: 'top'
                    //   });
                    //   toast.present();
                    this.http.get(url).map(res => res.json()).subscribe(data => {
                        this.posts = this.posts.concat(data.items);
                        this.storage.set(this.videosId, this.posts);
                        let date1 = new Date();
                        this.storage.set(this.dateUpdate, date1);
                    });
                } else {
                    console.log('Have videos');
                    // let toast = this.toastCtrl.create({
                    //     message: 'Already have Videos',
                    //     duration: 3000,
                    //     position: 'top'
                    //   });
                    // toast.present();
                    
                    this.posts = val
                }
            });
        });
    }

    tappedVideo(item) {
        this.youtube.openVideo(item.id.videoId);
    }
  }