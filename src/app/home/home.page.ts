import {AfterViewInit, Component, OnInit, ViewContainerRef} from '@angular/core';
import {ProductComponent} from './product/product.component';
import {AlertController, LoadingController, MenuController, ModalController, Platform} from '@ionic/angular';

import {Map} from '../shared/service/map';
import {SearchComponent} from './search/search.component';
import {loginRegister} from '../shared/service/login-register';
import { Plugins } from '@capacitor/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AddComponent} from "../login/license/add/add.component";
import {HistoryPage} from "../history/history.page";
import {RunningComponent} from "../history/running/running.component";
import {LoginPage} from "../login/login.page";
import {CodePage} from "../login/code/code.page";
import {ConfirmPage} from "../login/confirm/confirm.page";
import {HttpResponse} from "@angular/common/http";

const { Geolocation } = Plugins;



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  title = 'mapir-angular-test';
  login = false;
  flag = false;
  menuControl = false;
  errorMsg;
  recipe;
  subscription: Subscription;
  input;
  users;
  time;
  tansaction;
  stausMethod;
  humber = false;
  user;
  loadingFlag = false;
  show =false;
  center: any;
  process = false;
  geom = 'POINT(51.3379870719648 35.6986831795255)';
  markerPosition: any = [51.3380649, 35.700179] ;
  markerPosition2: any ;

  apiKey: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNmYjkzNmYzNzY5OWQzMThjMDBkYzc5NGNmZjM1YTdmNmJlNTllY2ZlYjg2ZDA1NjczODNlMWUxODEzZDY1ODcyOGFkYjJjYzA0ZGE4MjlmIn0.eyJhdWQiOiIxMzcyMCIsImp0aSI6ImNmYjkzNmYzNzY5OWQzMThjMDBkYzc5NGNmZjM1YTdmNmJlNTllY2ZlYjg2ZDA1NjczODNlMWUxODEzZDY1ODcyOGFkYjJjYzA0ZGE4MjlmIiwiaWF0IjoxNjE5NDE5MjA3LCJuYmYiOjE2MTk0MTkyMDcsImV4cCI6MTYyMjAxMTIwNywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.FdM-ON-0vS7zOGYvpD3yi6eJ4LxbTLY7UAZDErGQGJoRC91TP9O8W2XJBMpSZcl6ndLtMOkw60-ebb6OTQ0YTS0kEqpxEaEvlM3SnKSmJTqW2DzRONn6W3xWyf0BtGXLyulBeQh4fEl95iTUn7S_Rw4ojcmdjvcg9xsAd96pX8yswZyLLTwrWjr9XEvNeZedIURh88N2EF1XzKT2isY-6uE1YG3e1P9-Cfd470Lj0ojHTb29fkleaNH8yUG3lp8Hh9Ry0l_k66DqgUNiLcEoeuw5xWvcmu67hGTRjGz_cDDoR3PJ1eGCGILuUudjVldxpA-N2WKQcS2I3oEeJcCqCw';
  constructor(private modalController: ModalController,
              private router: Router,
              private route: ActivatedRoute,
              private userService: loginRegister,
              private map: Map,
              private alertCtrl: AlertController,
              private viewContainerRef: ViewContainerRef,
              private loading: LoadingController,) { }
    async ngOnInit() {
      this.dis();

      this.subscription = this.userService.loginEvent.subscribe(
        (recipes)=> {


          this.recipe = recipes;

        });
      this.subscription = this.userService.userInfo.subscribe(
        (recipes)=> {
          console.log('info update');

          this.users = recipes;
          console.log(this.users);
        });
      this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
        load.present();
        console.log('masoud');

        if (localStorage.getItem('token')) {
          console.log('masoud1');
          this.userService.validToken().subscribe((com: any) => {
            console.log('masoud3');
            if (com.status === 200) {
              console.log('masoud4');
              this.userService.getRunningHistory().subscribe((com: HttpResponse<any>) => {
                if (com.status === 200) {
                  if (com.body.length>0) {
                    console.log(com.body);
                    console.log('process');

                    this.process = true;

                    this.markerPosition2 = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
                    this.markerPosition = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
                    this.time = localStorage.getItem('customer-time');
                    console.log('this.time');
                    console.log(this.markerPosition2);
                    console.log(this.time);
                  } else {
                    this.process = false;
                  }
                  this.loading.dismiss();
                }
              }, err => {
                this.loading.dismiss();
                this.errorMsg = 'خطا در ورود به سامانه:' + err.status;

                this.alertCtrl.create({
                  message: this.errorMsg, buttons: [
                    {
                      text: 'تایید',
                      role: 'cancel'
                    }
                  ]
                }).then(alertEl => {
                  alertEl.present();
                });
              });
              this.loadingFlag = true;
              this.userService.loginEvent1();
              this.userService.getUser().subscribe((com: any) => {
                if (com.status === 200) {
                  this.user = com.body;
                  this.userService.infoEvent1(com.body);
                  console.log('masoud2');
                  console.log(com.body);
                  this.humber = true;
                  this.login = true;

                  this.loading.dismiss();
                }


              }, err => {
                this.userService.loginEvent2();
                this.loadingFlag = false;
                this.loading.dismiss();
              });
            } else {
              this.loadingFlag = false;
              this.userService.loginEvent2();
            }
          }, err => {
            this.userService.loginEvent2();
            this.loadingFlag = false;
            this.loading.dismiss();
          });


        } else {
          this.loadingFlag = false;
          this.humber = false;
          this.loading.dismiss();
        }

      });
      /*await this.userService.getUser().subscribe((com: any) => {
        if (com.status === 200) {
          this.user = com.body;
          this.flagMenu=true

        }


      }, err => {
        this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
        this.alertCtrl.create({
          message: this.errorMsg, buttons: [
            {
              text: 'تایید',
              role: 'cancel'
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });*/
      this.subscription = this.userService.recipeEvent.subscribe(
        (recipes)=>{
          console.log('subject');
          console.log(recipes);

          /*this.userService.getUser().subscribe((com: any) => {
           if (com.status === 200) {
           this.user = com.body;

           }


           }, err => {
           this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
           this.alertCtrl.create({
           message: this.errorMsg, buttons: [
           {
           text: 'تایید',
           role: 'cancel'
           }
           ]
           }).then(alertEl => {
           alertEl.present();
           });
           });*/
        }
      )
  }
  async dis() {

    await this.route.params.subscribe(
      (params: Params) => {
        if(params.status && params.transaction_id) {
          this.stausMethod = params.status;
          this.tansaction = params.transaction_id;
          console.log('process');
          console.log(this.process);
          this.process = true;
          this.markerPosition = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
          this.markerPosition2 = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
          this.time = localStorage.getItem('customer-time');
        }
      }
    );
  }
  async clickGps() {
    const position = await Geolocation.getCurrentPosition().then((resp) => {
      this.markerPosition = [resp.coords.longitude, resp.coords.latitude];
      this.center = [resp.coords.longitude, resp.coords.latitude];
      const address = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
        api: this.apiKey
      };
      this.map.address(address).subscribe((com: any) => {
        if (com.status === 200) {
          this.input = com.body.address_compact;
        }


      }, err => {
        this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
        this.alertCtrl.create({
          message: this.errorMsg, buttons: [
            {
              text: 'تایید',
              role: 'cancel'
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    }).catch((err) => {
    }) ;
  }
  clicked(e: any) {
    if (this.menuControl === true) {
      this.menuControl = false;
    }
    if (!this.process) {
      if ('lngLat' in e) {
        this.markerPosition = [e.lngLat.lng, e.lngLat.lat];
        this.center = [e.lngLat.lng, e.lngLat.lat];
        const address = {
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
          api: this.apiKey
        };
        this.map.address(address).subscribe((com: any) => {
          if (com.status === 200) {
            this.input = com.body.address_compact;
          }
        }, err => {
          this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
          this.alertCtrl.create({
            message: this.errorMsg, buttons: [
              {
                text: 'تایید',
                role: 'cancel'
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        });
      }
    }
  }
  dragged(e: any) {

    if (this.menuControl === true) {
      this.menuControl = false;
    }
    console.log(e._lngLat);
    this.markerPosition = [e._lngLat.lng, e._lngLat.lat];
    this.center = [e._lngLat.lng, e._lngLat.lat];
    const address = {
      lat: e._lngLat.lat,
      lng: e._lngLat.lng,
      api: this.apiKey
    };
    this.map.address(address).subscribe((com: any) => {
      if (com.status === 200) {
        this.input = com.body.address_compact;
      }
    }, err => {
      this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
      this.alertCtrl.create({
        message: this.errorMsg, buttons: [
          {
            text: 'تایید',
            role: 'cancel'
          }
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    });
  }
  async clickButton() {
    if (this.menuControl === true) {
      this.menuControl = false;
    }
    console.log('1');
    if (this.recipe) {
      this.loadingFlag = true;
      this.humber = true;


    } else {
      this.loadingFlag = false;
      this.humber = false;
    }
    if  (this.loadingFlag) {
      console.log('6');
      localStorage.setItem('addressFull', this.input);
      localStorage.setItem('long', this.markerPosition[0]);
      localStorage.setItem('lat', this.markerPosition[1]);
      this.modalCar();
    } else {
      console.log('7');
      localStorage.setItem('addressFull', this.input);
      localStorage.setItem('long', this.markerPosition[0]);
      localStorage.setItem('lat', this.markerPosition[1]);
      this.loginModal();
    }
    /*this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
      load.present();
      console.log('2');
      if (localStorage.getItem('token')) {
        this.userService.validToken().subscribe((com: any) => {
          if (com.status === 200) {
            console.log('3');
            this.loadingFlag = true;

              this.humber = true;
              this.login = true;
          } else {
            console.log('4');
            this.loadingFlag = false;
            this.humber = false;

          }
          console.log('5');
          this.loading.dismiss();
          if  (this.loadingFlag) {
            console.log('6');
            localStorage.setItem('addressFull', this.input);
            this.modalCar();
          } else {
            console.log('7');
            localStorage.setItem('addressFull', this.input);
            this.loginModal();
          }
        }, err => {
          console.log('8');
          this.loadingFlag = false;
          this.humber = false;
          this.loading.dismiss();
          if  (this.loadingFlag) {
            localStorage.setItem('addressFull', this.input);
            this.modalCar();
          } else {
            localStorage.setItem('addressFull', this.input);
            this.loginModal();
          }

        });


      } else {
        this.loadingFlag = false;
        this.humber = false;
        this.loading.dismiss();
        localStorage.setItem('addressFull', this.input);
        this.loginModal();
      }

    });*/
  }
  async modalSearch(){
    if (this.menuControl === true) {
      this.menuControl = false;
    }
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'custom-modal'
    });
    modal.onDidDismiss().then((data) => {
      if (localStorage.getItem('address')) {
        const lat = +localStorage.getItem('lat');
        const lng = +localStorage.getItem('lng');
        this.input = localStorage.getItem('address');
        this.markerPosition = [lat, lng];
        this.center = [lat, lng];
        localStorage.removeItem('lng');
        localStorage.removeItem('lat');
        localStorage.removeItem('address');

      }
    });
    return await modal.present();
  }
  clickMenu2() {
    if (this.menuControl === true) {
      this.menuControl = false;
    }
  }

  clickMenu() {
    console.log(this.users);
    if (this.users && this.users != undefined) {
      this.loadingFlag = true;
      this.humber = true;
      this.login = true;


    } else {
      this.loadingFlag = false;
      this.humber = false;
      this.login = false;
    }
    if (this.humber) {
      this.menuControl = !this.menuControl;
    } else {
      this.errorMsg = 'ابتدا وارد شوید:';
      this.alertCtrl.create({
        message: this.errorMsg, buttons: [
          {
            text: 'ورود',
            handler: () => {
              this.loginModal();
              if (this.menuControl === true) {
                this.menuControl = false;
              }
            }
          },
          {
            text: 'بستن',
            role: 'cancel'
          }
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    }

  }
  clickMap() {
  }
  exit() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      this.userService.loginEvent2();
      this.userService.infoEvent2();
    }
    if (this.menuControl === true) {
      this.menuControl = false;
    }
  }


  onMapLoaded(event) {
    event.map.resize();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.show = true;
      console.log('1');
      this.markerPosition = [51.338064963919834, 35.70017923069952];
      this.center = [51.338064963919834, 35.70017923069952];
      this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
        load.present();
        console.log('2');
        if (localStorage.getItem('latitude')) {
          console.log('3');
          this.markerPosition = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
          this.center = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
          const address = {
            lat: localStorage.getItem('latitude'),
            lng: localStorage.getItem('long'),
            api: this.apiKey
          };
          this.map.address(address).subscribe((com: any) => {
            if (com.status === 200) {
              this.input = com.body.address_compact;
              console.log('4');

            }


          }, err => {
            console.log('5');
            this.loading.dismiss();
            this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
            this.alertCtrl.create({
              message: this.errorMsg, buttons: [
                {
                  text: 'تایید',
                  role: 'cancel'
                }
              ]
            }).then(alertEl => {
              alertEl.present();
            });
          });
        } else {
          console.log('6');
          const address = {
            lat: '35.70017923069952',
            lng: '51.338064963919834',
            api: this.apiKey
          };
          this.map.address(address).subscribe((com: any) => {
            if (com.status === 200) {
              this.input = com.body.address_compact;
              console.log('7');

            }


          }, err => {
            console.log('8');
            this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
            this.alertCtrl.create({
              message: this.errorMsg, buttons: [
                {
                  text: 'تایید',
                  role: 'cancel'
                }
              ]
            }).then(alertEl => {
              alertEl.present();
            });
          });
        }
        console.log('10');
        this.loading.dismiss();
      });

      console.log('11');
      if (localStorage.getItem('lat')) {
        localStorage.removeItem('lng');
        localStorage.removeItem('lat');
        localStorage.removeItem('address');


      }
      console.log('12 ');
    }, 2000);
  }

  selfClose() {
    this.viewContainerRef
      .element
      .nativeElement
      .parentElement
      .removeChild(this.viewContainerRef.element.nativeElement);
  }
  async upadteUser(){
    if (this.menuControl === true) {
      this.menuControl = false;
    }
    const modal = await this.modalController.create({
      component: AddComponent,
      cssClass: 'custom-modal',
      componentProps: {
        update: 'new'
      }
    });
    return await modal.present();
  }
  async historyModal(){
    if (this.menuControl === true) {
      this.menuControl = false;
    }
    const modal = await this.modalController.create({
      component: HistoryPage,
      cssClass: 'custom-modal',
    });
    return await modal.present();
  }
  async edit(){
    if (this.menuControl === true) {
      this.menuControl = false;
    }

    const modal = await this.modalController.create({
      component: ConfirmPage,
      cssClass: 'custom-modal',
      componentProps: {
        update: 'new'
      }
    });
    modal.onDidDismiss().then((data) => {

      if (data.data.dismissed) {

      } else {
        console.log('remove token');
        localStorage.removeItem('token');
      }
    });
    return await modal.present();
  }
  async edit2(){


    const modal = await this.modalController.create({
      component: ConfirmPage,
      cssClass: 'custom-modal',
      componentProps: {
        update: 'update'
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log('edit2 first');
      if (data.data.dismissed) {
        if (this.menuControl === true) {
          this.menuControl = false;
          console.log('edit2');
        }
      }
    });
    return await modal.present();
  }
  async modalCode(){

    const modal = await this.modalController.create({
      component: CodePage,
      cssClass: 'custom-modal'
    });
    modal.onDidDismiss().then((data) => {
      console.log("exittttt");
      console.log(data);
      if (data.data.dismissed) {
        if (data.data.type === 'new') {
          this.edit();
        } else {
          this.modalCar();
        }
      }
    });
    return await modal.present();
  }
  async modalCar(){
      console.log('asdasdasdasd')
    const modal = await this.modalController.create({
      component: AddComponent,
      cssClass: 'custom-modal'
    });
    modal.onDidDismiss().then((data) => {
      console.log("exittttt");
      console.log(data);
      if (data.data.dismissed) {
        this.modalProduct();
      }
    });
    return await modal.present();
  }
  async modalProduct(){

    const modal = await this.modalController.create({
      component: ProductComponent,
      cssClass: 'custom-modal'
    });
    modal.onDidDismiss().then((data) => {
      console.log("exittttt");
      console.log(data);
      if (data.data.dismissed) {
        if (data.data.type === 'new') {

        }
      }
    });
    return await modal.present();
  }
  async modalConfirm(){

    const modal = await this.modalController.create({
      component: ConfirmPage,
      cssClass: 'custom-modal'
    });
    modal.onDidDismiss().then((data) => {
      console.log("exittttt");
      console.log(data);
      if (data.data.dismissed) {
        this.modalCar();
      }
    });
    return await modal.present();
  }
  async loginModal() {
    const modal2 = await this.modalController.create({
      component: LoginPage,
      cssClass: 'custom-modal',
    });
    modal2.onDidDismiss().then((data) => {
      console.log("exittttt");
      console.log(data);
      if (data.data.dismissed) {
        this.modalCode();
      }
    });
    return await modal2.present();
  }
}
