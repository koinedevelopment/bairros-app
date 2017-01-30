import { SorteiosPage } from './../pages/sorteios/sorteios';
import { FireService } from './../services/fire.service';
import { Component, ViewChild } from '@angular/core';
import { Platform, Events, NavController, NavParams, Modal } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {
  rootPage = HomePage;
  categorias;
  user; 
  public nav: any;
  constructor(platform: Platform, private fireService: FireService, private events: Events) {
    platform.ready().then(() => {
    this.events.subscribe('user:registered', user => {
      this.user = user;
      console.log('this.user: ',this.user)
    })

    this.fireService.getCategorias()
      .subscribe(categorias => {
        this.categorias = categorias;
      })
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  loginWithGoogle(){
    this.fireService.loginWithGoogle();
  }

  loginWithFacebook(){
    this.fireService.loginWithFacebook();
  }

  logout(){
    console.log('Logout');
    this.fireService.logout()
      .then(_ => {
        this.user = null;
      })
  }

  goToSorteios(){
    this.nav.push(SorteiosPage);
  }
}
