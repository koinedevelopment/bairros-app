import { PhotoViewer } from 'ionic-native';
import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { ListaEstabelecimentosPage } from './../lista-estabelecimentos/lista-estabelecimentos';
import { FireService } from './../../services/fire.service';
import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef  } from '@angular/core';
import { NavController, Slides, Content, Searchbar, LoadingController, Platform, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  showToolbar: boolean = false;
  myInput: string = '';
  categorias: any[];
  estabelecimentos: any[];
  filteredEstabelecimentos: any[];
  isSearch: boolean = false;
  isSearchEmpty: boolean = true;
  isRoot:boolean = true;
  destaques: any[] = null;
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;
  @ViewChildren('searchbar') searchbar: QueryList<Searchbar>;


  constructor(
    public navCtrl: NavController, 
    public changeDetectionRef: ChangeDetectorRef, 
    public fireService: FireService,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController
    ) { 
      
    }

  ionViewWillUnload(){
    console.log('ionViewWillUnload');
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter');
    this.platform.registerBackButtonAction(()=>{

        if(this.navCtrl.getActive().name == 'HomePage'){
          console.log('Clicou em sair register backbutton')
          if(this.isSearch){
          this.toggleSearchbar();
          }
          else{
            let alert = this.alertCtrl.create({
              title: 'Deseja sair?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {
                  }
                },
                {
                  text: 'Sair',
                  handler: () => {
                    this.exitApp();
                  }
                }
              ]
            })
            alert.present();
          }  
        }
        
      },0)
  }

  ionViewDidLoad(){

    this.fireService.getDestaques()
      .subscribe(destaques => {
        this.destaques = destaques;
      })
    this.fireService.getEstabelecimentos()
      .subscribe(estabelecimentos => {
        this.estabelecimentos = this.filteredEstabelecimentos = estabelecimentos;
      });

    let loading = this.loadingCtrl.create({
      content: 'Carregando categorias',
      showBackdrop: false
    });
    loading.present();

    this.fireService.getCategorias()
      .subscribe(categorias => {
        this.categorias = categorias;
        loading.dismiss();
        console.log(this.categorias);
      })
    this.slides.startAutoplay();
  }

  exitApp(){
    console.log('Exit app');
    this.platform.exitApp();
  }

  toggleSearchbar(){
    this.showToolbar = !this.showToolbar;
    this.isSearch = !this.isSearch;
     this.slides.startAutoplay()

    
    this.searchbar.changes.subscribe( result => {
        this.content.resize();
        let searchbar = <Searchbar>result.toArray()[0];
        if(searchbar){
          searchbar.setFocus();
          this.changeDetectionRef.detectChanges();  
        }
        

    })
  } 

  openImage(estabelecimento: any){
    let imagem = estabelecimento.imagemCapa;
    PhotoViewer.show(imagem,estabelecimento.nome,{share: false});
  }

  filter(event: Event){
    let search:string = event.srcElement['value'];
    if(!search)
      this.isSearchEmpty = true;
    else{
      this.isSearchEmpty = search.length > 0? false: true; //Verifica se o usuário digitou alguma coisa no searchbox para que o aplicativo não pesquise com o searchbox vazio
      this.filteredEstabelecimentos = this.estabelecimentos.filter(estabelecimento => estabelecimento.nome.toUpperCase().includes(search.toUpperCase()));
      console.log(this.filteredEstabelecimentos);
      console.log('searchbar: ', this.searchbar);
    }
  }

console(){
  console.log('teste');
}
  autostart(){
    this.slides.startAutoplay()

  }
  onSelectItem(item){
    if(this.isSearch && !this.isSearchEmpty){ //Se o usuário tiver digitando alguma pesquisa, o aplicativo deve levá-lo pra página do estabelecimento
      this.navCtrl.push(EstabelecimentoPage, {estabelecimento: item});
    }

    else{
      this.navCtrl.push(ListaEstabelecimentosPage, {
        keyCategoria: item.$key
      });
    }
    
    console.log(item)
  }

  selectDestaque(destaque){
    console.log('SelectDestaque', destaque)
    let filteredEstabelecimento = this.estabelecimentos.filter(estabelecimento => estabelecimento.$key == destaque.key_estabelecimento);
    this.navCtrl.push(EstabelecimentoPage, {estabelecimento: filteredEstabelecimento[0]});
  }
}
