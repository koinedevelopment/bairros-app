import { ContatoPage } from './../pages/contato/contato';
import { ModalLoginPage } from './../pages/modal-login/modal-login';
import { SorteiosRealizadosPage } from './../pages/sorteios-realizados/sorteios-realizados';
import { SorteiosPendentesPage } from './../pages/sorteios-pendentes/sorteios-pendentes';
import { SorteioModalPage } from './../pages/sorteio-modal/sorteio-modal';
import { SorteiosPage } from './../pages/sorteios/sorteios';
import { ParallaxHeader } from './../components/parallax-header/parallax-header';
import { ListaEstabelecimentosPage } from './../pages/lista-estabelecimentos/lista-estabelecimentos';
import { FireService } from './../services/fire.service';
import { EstabelecimentoPage } from './../pages/estabelecimento/estabelecimento';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AngularFireModule } from 'angularfire2';

const config = {
    apiKey: "AIzaSyA3MLge8e6_dGgcYjs8L4MAEeWVTT-QSjE",
    authDomain: "bairros-59d57.firebaseapp.com",
    databaseURL: "https://bairros-59d57.firebaseio.com",
    storageBucket: "bairros-59d57.appspot.com",
    messagingSenderId: "638539267125"
  };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EstabelecimentoPage,
    ListaEstabelecimentosPage,
    SorteiosPage,
    SorteioModalPage,
    SorteiosPendentesPage,
    SorteiosRealizadosPage,
    ModalLoginPage,
    ContatoPage,
    ParallaxHeader
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EstabelecimentoPage,
    ListaEstabelecimentosPage,
    SorteiosPage,
    SorteiosPendentesPage,
    SorteiosRealizadosPage,
    ModalLoginPage,
    ContatoPage,
    SorteioModalPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FireService
  ]
})
export class AppModule {}
