import { SorteioModalPage } from './../sorteio-modal/sorteio-modal';
import { FireService } from './../../services/fire.service';
import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-sorteios-pendentes',
  templateUrl: 'sorteios-pendentes.html'
})
export class SorteiosPendentesPage {
  sorteios: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public fireService: FireService, 
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
    ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromocoesPage');
    let loading = this.loadingCtrl.create({
      content: 'Carregando sorteios'
    });
    loading.present();
    this.fireService.getSorteios()
      .subscribe(sorteios => {
        this.sorteios = sorteios;
        loading.dismiss();
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
