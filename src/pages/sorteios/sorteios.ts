import { SorteiosRealizadosPage } from './../sorteios-realizados/sorteios-realizados';
import { SorteiosPendentesPage } from './../sorteios-pendentes/sorteios-pendentes';
import { SorteioModalPage } from './../sorteio-modal/sorteio-modal';
import { FireService } from './../../services/fire.service';
import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform } from 'ionic-angular';

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
  tab1 = SorteiosPendentesPage;
  tab2 = SorteiosRealizadosPage;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public fireService: FireService, 
    public modalCtrl: ModalController,
    public platform: Platform
    ) {}

  ionViewDidLoad() {
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    })
    
    this.fireService.getSorteios()
      .subscribe(sorteios => {
        this.sorteios = sorteios;
      })
  }

  ionViewDidEnter(){
    this.platform.registerBackButtonAction(() => {
        console.log('sorteios ionview')
        console.log('sorteios: ',this.navCtrl.getActive().name)
        if(this.navCtrl.getActive().name == 'SorteiosRealizadosPage' || this.navCtrl.getActive().name == 'SorteiosPendentesPage' || this.navCtrl.getActive().name == 'SorteiosPage')
          this.navCtrl.pop();
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
