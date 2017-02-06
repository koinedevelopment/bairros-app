import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-modal-login',
  templateUrl: 'modal-login.html'
})
export class ModalLoginPage {
  credencial: any;
  senha: string;
  email: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public fireService: FireService,
    public alertCtrl: AlertController
    ) {}

  ionViewDidLoad() {
    this.credencial = this.navParams.get('credencial');
    this.email = this.navParams.get('email');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  login(){
    this.fireService.loginWithPassword(this.email, this.senha, this.credencial)
      .then(result => {
        if(!result)   //Se deu tudo certo dismiss
          this.dismiss();
        else{
          if(result.code == "auth/wrong-password"){
            let alert = this.alertCtrl.create({
              title: 'Usuário e senhas não coincidem',
              subTitle: 'Tente novamente',
              buttons: ['OK']

            })
            alert.present();
          }

          else{
            let alert = this.alertCtrl.create({
              title: 'Algo deu errado',
              subTitle: 'Tente novamente mais tarde',
              buttons: ['OK']
            })
            alert.present();
          }
        }
        
      })
  }
}
