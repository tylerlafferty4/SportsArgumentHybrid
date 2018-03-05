import { Component, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class WordPressService {

    private WORDPRESS_REST_API_URL: string = 'http://www.sportsargument.com/wp-json/wp/v2/';

    constructor(private http: Http) {}

    public getRecentPosts(page:number = 1) {
        return this.http.get(
                this.WORDPRESS_REST_API_URL
                + 'posts?page=' + page)
            .map(res => res.json());
    }

    getComments(postId:number, page:number = 1){
        console.log(this.WORDPRESS_REST_API_URL
            + "comments?post=" + postId
            + '&page=' + page);
        
        return this.http.get(
          this.WORDPRESS_REST_API_URL
          + "comments?post=" + postId
          + '&page=' + page)
        .map(res => res.json());
      }
    
      getAuthor(author){
        return this.http.get(this.WORDPRESS_REST_API_URL + "users/" + author)
        .map(res => res.json());
      }

      createComment(postId, user, comment){
        let header: Headers = new Headers();
        // header.append('Authorization', 'Bearer ' + user.token);
    
        return this.http.post(this.WORDPRESS_REST_API_URL + "comments?author_name=Goose&author_email=tylerlafferty4@gmail.com&post=590", {
          author_name: 'Goose',
          author_email: 'tylerlafferty4@gmail.com',
          post: postId,
          content: comment
        }, { headers: header })
            .map(res => res.json());
      }
}