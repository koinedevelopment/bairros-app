import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-contato',
  templateUrl: 'contato.html'
})
export class ContatoPage {
  email: string;
  mensagem: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public fireService: FireService) {
      this.email = '';
      this.mensagem = '';
    }

  ionViewDidLoad() {
    console.log(this.email.length)
    console.log('ionViewDidLoad ContatoPage');
  }

  enviar(){
    this.fireService.sendMessage(this.email, this.mensagem)
      .then(_ => {
        let toast = this.toastCtrl.create({
          message: 'Agradecemos o contato. Em breve retornaremos a mensagem.',
          duration: 2500,
          showCloseButton: true,
          closeButtonText: 'X'
        })
        this.navCtrl.pop();
        toast.present();
      });
  }

}
