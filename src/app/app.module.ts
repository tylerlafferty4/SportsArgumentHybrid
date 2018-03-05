import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HttpModule } from '@angular/http';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

import { LockerRoomsPage } from '../pages/locker-rooms/locker-rooms';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TwitterPage } from '../pages/twitter/twitter';
import { PodcastsPage } from '../pages/podcasts/podcasts';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PostDetail } from '../pages/post-detail/post-detail';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { WordPressService } from '../services/word-press/word-press.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PipesModule } from '../pipes/pipes.module';

import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';

@NgModule({
  declarations: [
    MyApp,
    LockerRoomsPage,
    PodcastsPage,
    TwitterPage,
    HomePage,
    TabsPage,
    PostDetail,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    PipesModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LockerRoomsPage,
    TwitterPage,
    PodcastsPage,
    HomePage,
    TabsPage,
    PostDetail, 
    LoginPage, 
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    YoutubeVideoPlayer,
    WordPressService,
    AuthenticationService,
    InAppBrowser,
    ThemeableBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
