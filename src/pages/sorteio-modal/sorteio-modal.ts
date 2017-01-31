import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

/*
  Generated class for the SorteioModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sorteio-modal',
  templateUrl: 'sorteio-modal.html'
})
export class SorteioModalPage {
  sorteio: any = null;
  inscrito:boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public fireService: FireService,
    public platform: Platform
    ) {}

  ionViewDidLoad() {
    this.sorteio = this.navParams.get('sorteio');
    this.fireService.getInscricaoBySorteio(this.sorteio)
      .subscribe(inscricao => {
        if(inscricao[0])
          this.inscrito = true;
      })
    console.log('Sorteio: ', this.sorteio);
  }

  ionViewDidEnter(){
    console.log('this.viewCtrl.data: ', this.viewCtrl.data)
    this.platform.registerBackButtonAction(() => {
      try {
        this.viewCtrl.dismiss();
      }
      catch(e) {
        console.log(e);
      }
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  inscrever(){
    this.fireService.inscreverUsuario(this.sorteio)
      .then(_ => {
        alert('Inscrição realizada. Agora é só aguardar');
      })
  }
}
