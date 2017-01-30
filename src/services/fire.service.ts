import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Rx';
import { GooglePlus, Facebook } from 'ionic-native';
import { Events } from 'ionic-angular';
 
@Injectable()
export class FireService {

    constructor(public af: AngularFire, public events: Events) {
        firebase.auth().onAuthStateChanged(user => {
            console.log('onAuthState ',user);
            if(user){
                this.getUserByUid(user.uid)
                    .then(snap => {
                        this.events.publish('user:registered', snap.val())
                    })
            }
        })
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

    inscreverUsuario(sorteio: any):firebase.Promise<any> {
        let uid = firebase.auth().currentUser.uid;
        return this.af.database.list('inscricoes/').push({
            id_sorteio: sorteio.$key,
            id_usuario: uid,
            sorteio_usuario: sorteio.$key+'_'+uid
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

    //AUTH

    loginWithGoogle(){
        console.log('Login with google');
        GooglePlus.login({
            'webClientId': '638539267125-m93o2rp7gd1ueb6edt9ek8qkmqsh4ge4.apps.googleusercontent.com' 
        })
            .then(user => {
                console.log(user);
                let credential = firebase.auth.GoogleAuthProvider.credential(user.idToken);
                firebase.auth().signInWithCredential(credential)
                    .then(data => {
                        this.saveUserInfo(user)
                            .then(_ => {
                                this.getUserByUid(data.uid)
                                    .then(snap => {
                                        console.log('Usuário criado');
                                    })
                            })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            });
    }

    loginWithFacebook(){
        Facebook.login(['user_friends', 'public_profile', 'email'])
            .then(userFacebook => {
                let credential = firebase.auth.FacebookAuthProvider.credential(userFacebook.authResponse.accessToken);
                firebase.auth().signInWithCredential(credential)
                    .then(user => {
                        console.log('Login with facebook', user);
                        this.saveUserInfo(user);
                    })
                    .catch(err => {
                        console.log(err)
                        if(err['code'] == 'auth/account-exists-with-different-credential'){
                            firebase.auth().fetchProvidersForEmail(err['email'])
                                .then(providers => {
                                    this.fetchProviders(providers[0])
                                        .then(credentialReturned => {
                                            firebase.auth().signInWithCredential(credentialReturned)
                                                .then(userLogged => {
                                                    userLogged.link(credential);
                                                    this.saveUserInfo(userLogged);
                                                })
                                                .catch(error => {
                                                    console.log('Erro após link: ',error);
                                                });

                                        })
                                })
                        }
                    })
            })
    }

    saveUserInfo(user){
        let currentUser = firebase.auth().currentUser; 
        let uid = currentUser.uid;
        console.log('Current user (Save user info)', currentUser);
        let promise: Promise<any>; 
        let obj_user: any;
        //Tratando se o usuário logou com o Facebook ou com o Google. Alguns campos tem nomes diferentes
        if(user.providerData[0].providerId == 'facebook.com'){
            obj_user = {
                uid: uid,
                nome: user.displayName,
                imagem: user.photoURL,
                email: user.email 
            }
        }

        if(user.providerData[0].providerId == 'google.com'){
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
                    if(!snapshot.val()){
                        firebase.database().ref('usuarios_app/'+uid).set(obj_user)
                        .then(data => {
                            resolve(true);
                        })
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

    logout(){
        return firebase.auth().signOut();
    }
}