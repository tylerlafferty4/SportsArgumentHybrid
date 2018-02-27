import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HttpModule } from '@angular/http';
import { YtProvider } from '../providers/yt/yt';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

import { LockerRoomsPage } from '../pages/locker-rooms/locker-rooms';
import { TwitterPage } from '../pages/twitter/twitter';
import { PodcastsPage } from '../pages/podcasts/podcasts';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PostDetail } from '../pages/post-detail/post-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    LockerRoomsPage,
    PodcastsPage,
    TwitterPage,
    HomePage,
    TabsPage,
    PostDetail
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LockerRoomsPage,
    TwitterPage,
    PodcastsPage,
    HomePage,
    TabsPage,
    PostDetail
  ],
  providers: [
    StatusBar,
    SplashScreen,
    YoutubeVideoPlayer,
    YtProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
