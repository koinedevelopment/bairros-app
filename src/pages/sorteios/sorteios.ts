import { SorteioModalPage } from './../sorteio-modal/sorteio-modal';
import { FireService } from './../../services/fire.service';
import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

/*
  Generated class for the Sorteios page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sorteios',
  templateUrl: 'sorteios.html'
})
export class SorteiosPage {
sorteios: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireService: FireService, public modalCtrl: ModalController) {}

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

  inscrever(sorteio){
    let modalSorteio = this.modalCtrl.create(SorteioModalPage,{sorteio: sorteio});
    modalSorteio.present();

  }

}
