import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthenticationService {

    private WORDPRESS_REST_API_URL: string = 'http://sportsargument.com/wp-json/wp/v2/';
    private WORDPRESS_URL: string = 'http://sportsargument.com/'
  constructor(
    public nativeStorage: Storage,
    public http: Http
  ){}

  getUser(){
    return this.nativeStorage.get('User');
  }

  setUser(user){
    return this.nativeStorage.set('User', user);
  }

  logOut(){
    return this.nativeStorage.clear();
  }

  doLogin(username, password){
    return this.http.post(this.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token',{
      username: username,
      password: password
    })
  }

  doRegister(user_data, token){
    return this.http.post(this.WORDPRESS_REST_API_URL + 'users?token=' + token, user_data);
  }

  validateAuthToken(token){
    let header : Headers = new Headers();
    header.append('Authorization','Basic ' + token);
    return this.http.post(this.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token/validate?token=' + token,
      {}, {headers: header})
  }
}

