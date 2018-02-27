import { YtProvider } from './../../providers/yt/yt';
import {Component} from '@angular/core';
import {Modal, NavController, Alert} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'podcasts-page',
  templateUrl: 'podcasts.html'
})
export class PodcastsPage {
    channelID: string = 'UC1egVmcqGXQv2tgdiy0ajHA';
    maxResults: string = '10';
    pageToken: string; 
    googleToken: string = 'AIzaSyBK4TGpJZ-fOsmG1BqIOb8CP_lBox9k6o0';
    searchQuery: string = '';
    posts: any = [];
    onPlaying: boolean = false; 
  
    constructor(public http: Http, public nav:NavController, public ytPlayer: YtProvider) {
      this.loadSettings();
    }
  
    launchYTPlayer(id, title): void {
      this.ytPlayer.launchPlayer(id, title);
    }
  
    fetchData(): void {
  
      let url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=' + this.channelID + '&q=' + this.searchQuery + '&type=video&order=viewCount&maxResults=' + this.maxResults + '&key=' + this.googleToken;
  
      if(this.pageToken) {
        url += '&pageToken=' + this.pageToken;
      }
  
      this.http.get(url).map(res => res.json()).subscribe(data => {
        
        console.log (data.items);
        // *** Get individual video data like comments, likes and viewCount. Enable this if you want it.
        // let newArray = data.items.map((entry) => {
        //   let videoUrl = 'https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics&id=' + entry.id.videoId + '&key=' + this.googleToken;
        //   this.http.get(videoUrl).map(videoRes => videoRes.json()).subscribe(videoData => {
        //     console.log (videoData);
        //     this.posts = this.posts.concat(videoData.items);
        //     return entry.extra = videoData.items;
        //   });
        // });
        this.posts = this.posts.concat(data.items);
      });
    }
    loadSettings(): void {
        this.fetchData();
    }
    openSettings(): void {
        console.log("TODO: Implement openSettings()");
    }
    playVideo(e, post): void {
        console.log(post);
        this.onPlaying = true;
        this.ytPlayer.launchPlayer(post.id, post.snippet.title);
    }
    loadMore(): void {
        console.log("TODO: Implement loadMore()");
    }
  }