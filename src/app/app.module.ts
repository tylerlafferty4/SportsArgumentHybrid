import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, NavController } from 'ionic-angular';
import { MyApp } from './app.component';
import { HTTP } from '@ionic-native/http';

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
import { AddRoomPage } from '../pages/add-room/add-room';
import { ChatPage } from '../pages/chat/chat';
import { InviteUserPage } from '../pages/invite-user/invite-user';
import { PhotoWallPage } from '../pages/photo-wall/photo-wall';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { WordPressService } from '../services/word-press/word-press.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PipesModule } from '../pipes/pipes.module';

import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { FCM } from '@ionic-native/fcm';
import { Facebook } from '@ionic-native/facebook';
import { config } from '../config/config';

import { AdMobFree } from '@ionic-native/admob-free';

import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PhotoUploadPage } from '../pages/photo-upload/photo-upload';
import { PhotoCommentPage } from '../pages/photo-comment/photo-comment';
// import { SoundCloudProvider } from '../providers/sound-cloud/sound-cloud';

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
    RegisterPage,
    ChatPage,
    AddRoomPage,
    InviteUserPage,
    PhotoWallPage,
    PhotoUploadPage,
    PhotoCommentPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    PipesModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config.firebase),
    AngularFireAuthModule
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
    RegisterPage,
    AddRoomPage,
    ChatPage,
    InviteUserPage,
    PhotoWallPage,
    PhotoUploadPage,
    PhotoCommentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    YoutubeVideoPlayer,
    WordPressService,
    AuthenticationService,
    InAppBrowser,
    ThemeableBrowser,
    AdMobFree,
    Facebook,
    FCM,
    HTTP,
    Camera,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
   // SoundCloudProvider
  ]
})
export class AppModule {}
