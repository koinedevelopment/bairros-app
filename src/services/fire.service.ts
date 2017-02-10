import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Rx';
import { GooglePlus, Facebook, Network, ScreenOrientation } from 'ionic-native';
import { Events } from 'ionic-angular';

declare var navigator: any;
declare var Connection: any;

@Injectable()
export class FireService {
    public uid: string = '';
    public auth = firebase.auth();

    constructor(public af: AngularFire, public events: Events) {
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.uid = user.uid;
                console.log('onAuthState ',user);
                /* this.getUserByUid(user.uid)
                    .then(snap => {
                        this.events.publish('user:registered', snap.val())
                    }) */
            }
        })
    }

    checkConnection(){
        Network.onConnect()
            .subscribe(_ =>{
                console.log('console.log: ', Network.connection);
            })
    }

    lockOrientation(){
        ScreenOrientation.lockOrientation('portrait');
    }
    saveCategoria(categoria: string): firebase.Promise<any> {
        return firebase.database().ref('categorias/').push({nome: categoria});
    }

    getCategorias(): Observable<any>{
        return this.af.database.list('categorias', {
            query: {
                orderByChild: 'ativo',
                equalTo: true
            }
        });
    }
    
    getCategoriasComEstabelecimentos(): Observable<any>{
        return this.af.database.list('categorias_estabelecimentos');
    }

    getEstabelecimentos():Observable<any>{
        return this.af.database.list('estabelecimentos');
    }

    getEstabelecimentoById(id: string): firebase.Promise<any>{
        return firebase.database().ref('estabelecimentos/'+id).once('value');
    }

    getEstabelecimentosByKeyCategoria(key: string):Observable<any> {
        return this.af.database.list('estabelecimentos', {
            query: {
                orderByChild: 'categoria_validade',
                equalTo: key+'_'+true
            }
        })
    }

    getCategoriaByKey(key):Observable<any> {
        return this.af.database.object('categorias/'+key);
    }

    getDestaques(){
        return this.af.database.list('destaques/');
    }

    getSorteios(): Observable<any> {
        return this.af.database.list('sorteios/', {
            query: {
                orderByChild: 'pendente',
                equalTo: true
            }
        })
    }

    getSorteiosRealizados(): Observable<any> {
        return this.af.database.list('sorteios/', {
            query: {
                orderByChild: 'pendente',
                equalTo: false
            }
        })
    }

    inscreverUsuario(sorteio: any):firebase.Promise<any> {
        let uid = firebase.auth().currentUser.uid;
        let email = firebase.auth().currentUser.email;
        let nome = firebase.auth().currentUser.displayName;

        return this.af.database.list('inscricoes/').push({
            id_sorteio: sorteio.$key,
            id_usuario: uid,
            sorteio_usuario: sorteio.$key+'_'+uid,
            nome_usuario: nome,
            email_usuario: email
        });
    }

    getInscricaoBySorteio(sorteio): Observable<any>{
        let uid = firebase.auth().currentUser.uid;
        return this.af.database.list('inscricoes/',{
            query: {
                orderByChild: 'sorteio_usuario',
                equalTo: sorteio.$key+'_'+uid
            }
        })
    }
    
    sendMessage(email: string, mensagem: string): firebase.Promise<any>{
        return firebase.database().ref('contato').push({
            mensagem: mensagem,
            email: email
        })
    }
    //AUTH

/*    loginWithGoogle(){
        console.log('Login with google');
        GooglePlus.login({
            'webClientId': '1021888722973-nm3dbhme2o6mbemjt4akh0s6vh8gcp79.apps.googleusercontent.com' 
        })
            .then(user => {
                console.log(user);
                let credential = firebase.auth.GoogleAuthProvider.credential(user.idToken);
                firebase.auth().signInWithCredential(credential)
                    .then(data => {
                        this.saveUserInfo(user, 'google')
                            .then(_ => {
                                 this.getUserByUid(user.uid)
                                    .then(snap => {
                                        //this.events.publish('user:registered', snap.val())
                                    }) 
                            })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            });
    } */

    loginWithFacebook(): Promise<any>{
        let promise: Promise<any>;
        promise = new Promise((resolve, reject) => {
            Facebook.login(['user_friends', 'public_profile', 'email'])
                .then(userFacebook => {
                    let accessToken = userFacebook.authResponse.accessToken;
                    let credential: firebase.auth.AuthCredential;
            
                    console.log('credential: ', credential)
                    console.log('firebase authProvider: ', firebase.auth.FacebookAuthProvider.credential(accessToken));
                    firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(accessToken))
                        .then(user => {
                            console.log('User após credencial: ', user);
                            this.saveUserInfoCurrent();
                            return resolve('logado');
                        })
                        .catch(err => {
                            console.log(err);
                            if(err['code'] == "auth/email-already-in-use" || err['code'] == "auth/account-exists-with-different-credential"){
                                return resolve(err);

                            }
                        })
                })
        });
        return promise;
    }

    loginWithPassword(email: string, password: string, credencial: any): firebase.Promise<any>{
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                firebase.auth().currentUser.link(credencial)
                    .then(result => {
                        console.log(result);
                        this.auth.currentUser.updateProfile({displayName: result.providerData[0].displayName, photoURL: result.providerData[0].photoURL})
                            .then(_ => {
                                console.log(this.auth.currentUser);
                                this.saveUserInfoCurrent();
                            })
                    })
            })
            .catch(err => {
                console.log(err);
                return err;
            })
    }

    saveUserInfoCurrent():firebase.Promise<any>{
        let user = this.auth.currentUser;
        let obj_user = {
                uid: user.uid,
                nome: user.displayName,
                imagem: user.photoURL,
                email: user.email 
            }
        return firebase.database().ref('usuarios_app/'+user.uid).set(obj_user)
    }

    saveUserInfo(user:any, provider: string){
        console.log('user saveinfo: ', user);
        let currentUser = firebase.auth().currentUser; 
        let uid = currentUser.uid;
        console.log('Current user (Save user info)', currentUser);
        let promise: Promise<any>; 
        let obj_user: any;
        //Tratando se o usuário logou com o Facebook ou com o Google. Alguns campos tem nomes diferentes
        if(provider == 'facebook'){
            obj_user = {
                uid: uid,
                nome: user.displayName,
                imagem: user.photoURL,
                email: user.email 
            }
        }

        if(provider == 'google'){
            obj_user = {
                uid: uid,
                nome: user.displayName,
                imagem: user.imageUrl,
                email: user.email 
            }
        }
        promise = new Promise((resolve, reject)=>{
            firebase.database().ref('usuarios_app/'+uid).once('value')
                .then(snapshot => {
                    console.log('snapshot verificação se há usuario cadastrado', snapshot.val());
                    if(!snapshot.val()){
                        firebase.database().ref('usuarios_app/'+uid).set(obj_user)
                        .then(data => {
                            resolve(true);
                        })
                    }
                    if(snapshot.val()){
                        //this.events.publish('user:registered', snapshot.val())
                    }
                })
        })
        return promise;
    }


    fetchProviders(provider): Promise<any> {
        
        if(provider === 'google.com'){
            let promise = new Promise((resolve, reject) => {
                GooglePlus.login({'webClientId': '638539267125-m93o2rp7gd1ueb6edt9ek8qkmqsh4ge4.apps.googleusercontent.com' })
                    .then(user => {
                        let credential = firebase.auth.GoogleAuthProvider.credential(user.idToken) 
                        console.log('credential let promise: ',credential);
                        resolve(credential);                    
                    })
            });
            return promise;            
        }
    }

    getUserByUid(uid): firebase.Promise<any> {
        return firebase.database().ref('usuarios_app/'+uid).once('value');
    }

    getUserId():string{
        return firebase.auth().currentUser.uid;
    }

    checkLogin(){
        let uid = firebase.auth().currentUser.uid;
        this.getUserByUid(uid)
            .then(snap => {
                if(snap.val()){
                    console.log('Está logado.')
                    //this.events.publish('user:registered', snap.val())
                }
                else{
                    console.log('Nao está logado');
                }
            })
    }
    logout(){
        return firebase.auth().signOut();
    }
}