import { ModalLoginPage } from './../pages/modal-login/modal-login';
import { SorteiosPage } from './../pages/sorteios/sorteios';
import { FireService } from './../services/fire.service';
import { Component, ViewChild } from '@angular/core';
import { Platform, Events, NavController, NavParams, Modal, LoadingController, ModalController } from 'ionic-angular';
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
  constructor(
    platform: Platform, 
    public fireService: FireService, 
    public events: Events,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
    ) {

    platform.ready().then(() => {
      Splashscreen.hide();
      //this.fireService.lockOrientation();
      //this.fireService.checkConnection();
      firebase.auth().onAuthStateChanged(user => {
        this.user = user;
      })

      this.events.subscribe('user:registered', user => {
        this.user = user;
        console.log('this.user: ',this.user)
      });
      
    

    this.fireService.getCategorias()
      .subscribe(categorias => {
        this.categorias = categorias;
      })
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  loginWithFacebook(){
    this.fireService.loginWithFacebook()
      .then(result => {
        console.log('retorno login with facebook: ', result);
        if(result != 'logado' && result){
          let modalSorteio = this.modalCtrl.create(ModalLoginPage, {credencial: result.credential, email: result.email});
          modalSorteio.present();
        }
      })
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
