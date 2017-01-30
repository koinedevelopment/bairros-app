import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { PhotoViewer } from 'ionic-native';

@Component({
  selector: 'page-lista-estabelecimentos',
  templateUrl: 'lista-estabelecimentos.html'
})
export class ListaEstabelecimentosPage {

  keyCategoria: string;
  estabelecimentos: any[];
  categoria: string = '';
  title: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireService: FireService, public loadingCtrl: LoadingController) {
    this.keyCategoria = this.navParams.get('keyCategoria');
    this.fireService.getCategoriaByKey(this.keyCategoria)
      .subscribe(categoria => {
        this.categoria = categoria;
        this.title = categoria.nome;
      })
      
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
        content: 'Carregando estabelecimentos',
        showBackdrop: false
      });
    loading.present();
    this.fireService.getEstabelecimentosByKeyCategoria(this.keyCategoria)
      .subscribe(estabelecimentos => {
        loading.dismiss();
        this.estabelecimentos = estabelecimentos;
        console.log(this.estabelecimentos);
      });

  }

  openImage(estabelecimento: any){
    let imagem = estabelecimento.imagemCapa;
    PhotoViewer.show(imagem,estabelecimento.nome,{share: false});
  }

  onSelectEstabelecimento(estabelecimento){
    this.navCtrl.push(EstabelecimentoPage, {estabelecimento: estabelecimento});
    console.log(estabelecimento);
  }

}
