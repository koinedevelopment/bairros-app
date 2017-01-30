import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Promocoes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-promocoes',
  templateUrl: 'promocoes.html'
})
export class PromocoesPage {
  sorteios: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireService: FireService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromocoesPage');
    
    this.fireService.getSorteios()
      .subscribe(sorteios => {
        this.sorteios = sorteios;
      })
  }

  goToEstabelecimento(key: string){
    this.fireService.getEstabelecimentoById(key)
      .then(snap => {
        this.navCtrl.push(EstabelecimentoPage,{estabelecimento: snap.val()});
      })
  }



}
