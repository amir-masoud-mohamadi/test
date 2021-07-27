import {AfterViewInit, Component, OnInit, ViewContainerRef} from '@angular/core';
import {ProductComponent} from './product/product.component';
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';

import {Maps} from '../shared/service/map';
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
import {DatePipe} from "@angular/common";
import {OrderTrackingComponent} from "./order-tracking/order-tracking.component";
import {timer} from "rxjs/internal/observable/timer";
import {interval} from "rxjs/internal/observable/interval";
import {ReceiveComponent} from "./receive/receive.component";
import {Map} from "mapbox-gl";
import {PeygiriComponent} from "./peygiri/peygiri.component";

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
  zoomis = 17;
  tansaction;
  orderId;
  stausMethod;
  humber = false;
  user;
  loadingFlag = false;
  show =false;
  countDown:Subscription;
  counter = 120000;
  tick = 60000;
  process = false;
  geom = 'POINT(51.3379870719648 35.6986831795255)';
  markerPosition: any = [51.338064963919834, 35.70017923069952];
  gps = {
    lng:51.338064963919834,
    lat:35.70017923069952
  };
  center: [number,number] = [51.338064963919834, 35.70017923069952];
  markerPosition2: any ;
  orderProduct;
  customerProduct;
  duration;
  running: boolean;
  apiKey: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNmYjkzNmYzNzY5OWQzMThjMDBkYzc5NGNmZjM1YTdmNmJlNTllY2ZlYjg2ZDA1NjczODNlMWUxODEzZDY1ODcyOGFkYjJjYzA0ZGE4MjlmIn0.eyJhdWQiOiIxMzcyMCIsImp0aSI6ImNmYjkzNmYzNzY5OWQzMThjMDBkYzc5NGNmZjM1YTdmNmJlNTllY2ZlYjg2ZDA1NjczODNlMWUxODEzZDY1ODcyOGFkYjJjYzA0ZGE4MjlmIiwiaWF0IjoxNjE5NDE5MjA3LCJuYmYiOjE2MTk0MTkyMDcsImV4cCI6MTYyMjAxMTIwNywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.FdM-ON-0vS7zOGYvpD3yi6eJ4LxbTLY7UAZDErGQGJoRC91TP9O8W2XJBMpSZcl6ndLtMOkw60-ebb6OTQ0YTS0kEqpxEaEvlM3SnKSmJTqW2DzRONn6W3xWyf0BtGXLyulBeQh4fEl95iTUn7S_Rw4ojcmdjvcg9xsAd96pX8yswZyLLTwrWjr9XEvNeZedIURh88N2EF1XzKT2isY-6uE1YG3e1P9-Cfd470Lj0ojHTb29fkleaNH8yUG3lp8Hh9Ry0l_k66DqgUNiLcEoeuw5xWvcmu67hGTRjGz_cDDoR3PJ1eGCGILuUudjVldxpA-N2WKQcS2I3oEeJcCqCw';
  constructor(private modalController: ModalController,
              private router: Router,
              private route: ActivatedRoute,
              private userService: loginRegister,
              private map: Maps,
              private platform: Platform,
              private alertCtrl: AlertController,
              private viewContainerRef: ViewContainerRef,
              private loading: LoadingController,
              private toastController: ToastController
              ) {


    this.route.params.subscribe(

      (params: Params) => {

      }
    );

  }
    async ngOnInit() {

      this.time = localStorage.getItem('customer-time');

      let times;
      if (localStorage.getItem('timeEvent')) {
        times= +localStorage.getItem('timeEvent');
      } else {
        times = 0;
      }

      this.countDown = timer(0, this.tick)
        .subscribe(() => {
          if (+this.time > 0) {
            console.log('time');
            if (this.time) {
              --this.time;
              localStorage.setItem('customer-time', this.time);


              this.userService.timeEvent1(this.time);
              times = ++times;
              localStorage.setItem('timeEvent', times);
              this.userService.levelEvent1(times);
            }
          }
        });


      this.subscription = this.userService.loginEvent.subscribe(
        (recipes)=> {


          this.recipe = recipes;

        });
      this.subscription = this.userService.userInfo.subscribe(
        (recipes)=> {
          this.users = recipes;
        });
      this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
        load.present();
        console.log('1');
        if (localStorage.getItem('token')) {
          console.log('2');
          this.userService.validToken().subscribe((com: HttpResponse<any>) => {
            console.log('3');
            console.log(com);
            if (com.status === 200) {
              console.log('4');
              this.checkProduct();
              this.loadingFlag = true;
              this.userService.loginEvent1();
              this.userService.getUser().subscribe((com: any) => {
                if (com.status === 200) {
                  this.user = com.body;
                  this.userService.infoEvent1(com.body);

                  this.humber = true;
                  this.login = true;


                }
                this.loading.dismiss()

              }, err => {
                this.userService.loginEvent2();
                this.loadingFlag = false;
                this.loading.dismiss();
              });
            } else {
              this.loading.dismiss();
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
          this.process = true;
          this.markerPosition = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
          this.markerPosition2 = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
          this.time = localStorage.getItem('customer-time');
          this.zoomis = 12;

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

    if (this.recipe) {
      this.loadingFlag = true;
      this.humber = true;


    } else {
      this.loadingFlag = false;
      this.humber = false;
    }
    if  (this.loadingFlag) {

      localStorage.setItem('addressFull', this.input);
      localStorage.setItem('long', this.gps.lng.toString());
      localStorage.setItem('latitude', this.gps.lat.toString());
      this.modalCar();
    } else {

      localStorage.setItem('addressFull', this.input);
      localStorage.setItem('long', this.gps.lng.toString());
      localStorage.setItem('latitude', this.gps.lat.toString());
      this.loginModal();
    }
  }
  async clickButton2() {
    if (this.menuControl === true) {
      this.menuControl = false;
    }
    if(this.running) {
      const modal = await this.modalController.create({
        component: OrderTrackingComponent,
        cssClass: 'custom-modal',
        componentProps: {
          update: 'new',
          customer:this.customerProduct,
          product: this.orderProduct,
          orderId: this.orderId,

        }
      });
      modal.onDidDismiss().then((data) => {
        if (data.data.final) {
          this.process = false;
          this.running= undefined;
          localStorage.removeItem('customer-lat');
          localStorage.removeItem('customer-lng');
          localStorage.removeItem('company_id');
          localStorage.removeItem('customer-time');
          localStorage.removeItem('timeEvent');
          localStorage.removeItem('company');
        }
      });
      return await modal.present();
    } else {
      if (this.orderId) {

      } else {
        this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
          load.present();
          this.userService.getRunningHistory2().subscribe((com11: HttpResponse<any>) => {
            console.log('11');
            if (com11.status === 200) {
              console.log('12');
              console.log(com11);

              if (com11.body.length>0) {
                this.running = false;
                console.log('13');
                this.orderId = com11.body[0].id;
                this.process = true;
                /*}*/


              } else {
                this.process = false;

                this.loading.dismiss();
              }

            }

          }, err => {
            this.loading.dismiss();
            if (err.status === 401 ) {
              this.process = false;
            }else {
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
            }


          });
        });
      }
      this.alertCtrl.create({
        message:'پرداخت ناموفق' , buttons: [
          {
            text: 'تلاش مجدد',
            handler:()=> {
              this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
                load.present();
                let id;
                if(this.platform.is('desktop')) {
                  id = {
                    "order_id": this.orderId,
                    "payment_method": "zarinpal_json",
                    "callback_url": "https://geofahm.ir/wps/tak.html"
                  };
                } else {
                  id = {
                    "order_id": this.orderId,
                    "payment_method": "zarinpal_json",
                    "callback_url": "https://geofahm.ir/wps/tak.html"
                  };
                }

                this.userService.paymentOrder(id).subscribe((com3: HttpResponse<any>) => {
                  if (com3.status === 200) {
                    if(com3.body.result) {


                      /*this.router.navigate([com3.body.redirect])*/
                      window.location.href = com3.body.redirect;
                      this.loading.dismiss();
                    }

                  }
                }, err => {
                  this.loading.dismiss();
                  this.alertCtrl.create({
                    message:'خطا در ورود به سامانه:', buttons: [
                      {
                        text: 'تایید',
                        role: 'cancel'
                      }
                    ]
                  }).then(alertEl => {
                    alertEl.present();
                  });
                });

              });

            }
          },
          {
            text: 'لغو درخواست',
            handler:()=> {
              this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
                load.present();

                let id = {
                  status: 'cancelled'
                };
                this.userService.changeStatus(id, this.orderId).subscribe((com3: HttpResponse<any>) => {
                  if (com3.status === 200) {

                    localStorage.removeItem('customer-lat');
                    localStorage.removeItem('customer-lng');
                    localStorage.removeItem('company_id');
                    localStorage.removeItem('customer-time');
                    localStorage.removeItem('timeEvent');
                    localStorage.removeItem('company');
                      this.loading.dismiss();
                      this.process = false;
                      this.running = undefined;



                  }
                }, err => {
                  console.log(err);
                  this.loading.dismiss();
                  this.alertCtrl.create({
                    message:'خطا در ورود به سامانه:', buttons: [
                      {
                        text: 'تایید',
                        role: 'cancel'
                      }
                    ]
                  }).then(alertEl => {
                    alertEl.present();
                  });
                });

              });
            }
          }
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    }
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
              this.loginModalMenu();
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
      this.process = false;
      localStorage.removeItem('token');
      this.userService.loginEvent2();
      this.userService.infoEvent2();
    }
    if (this.menuControl === true) {
      this.menuControl = false;
    }
  }




  ngAfterViewInit(): void {
    setTimeout(() => {
      this.show = true;


      this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
        load.present();



          const address = {
            lat: '35.70017923069952',
            lng: '51.338064963919834',
            api: this.apiKey
          };
          this.map.address(address).subscribe((com: any) => {
            if (com.status === 200) {
              this.input = com.body.address_compact;
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
        /*}*/

      });



      this.dis();

    }, 4000);

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
        this.modalCar();
      } else {

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

      if (data.data.dismissed) {
        if (this.menuControl === true) {
          this.menuControl = false;

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
      if (data.data.dismissed) {
        if (data.data.type === 'new') {
          this.edit();
        } else {
          this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
            load.present();
            this.userService.getRunningHistory().subscribe((com: HttpResponse<any>) => {
              if (com.status === 200) {
                if (com.body.length>0) {


                  this.process = true;

                  this.markerPosition2 = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
                  this.center  = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
                  this.userService.markerEvent1(this.markerPosition2);
                  this.zoomis = 12;
                  this.markerPosition = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
                  this.time = localStorage.getItem('customer-time');
                  this.loading.dismiss();
                } else {
                  this.loading.dismiss();
                  this.process = false;
                  this.modalCar();
                }
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
          });


        }
      }
    });
    return await modal.present();
  }
  async modalCodeMenu(){

    const modal = await this.modalController.create({
      component: CodePage,
      cssClass: 'custom-modal'
    });
    modal.onDidDismiss().then((data) => {
      if (data.data.dismissed) {

          this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
            load.present();
            this.userService.getRunningHistory().subscribe((com: HttpResponse<any>) => {
              if (com.status === 200) {
                if (com.body.length>0) {


                  this.process = true;

                  this.markerPosition2 = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
                  this.center  = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
                  this.userService.markerEvent1(this.markerPosition2);
                  this.zoomis = 12;
                  this.markerPosition = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
                  this.time = localStorage.getItem('customer-time');
                  this.loading.dismiss();
                } else {
                  this.loading.dismiss();
                  this.process = false;

                }
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
          });



      }
    });
    return await modal.present();
  }
  async modalCar(){

    const modal = await this.modalController.create({
      component: AddComponent,
      cssClass: 'custom-modal'
    });
    modal.onDidDismiss().then((data) => {

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
        console.log('return application');

      if (data.data.final) {
        if(!this.platform.is('desktop')) {
          this.peygiriModal();
        } else{

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
      if (data.data.dismissed) {
        this.modalCode();
      }
    });
    return await modal2.present();
  }
  async peygiriModal() {
    const modal2 = await this.modalController.create({
      component: PeygiriComponent,
      cssClass: 'custom-modal',
    });
    modal2.onDidDismiss().then((data) => {
      this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
        load.present();
        this.checkProduct();
      });
    });
    return await modal2.present();
  }
  async loginModalMenu() {
    const modal2 = await this.modalController.create({
      component: LoginPage,
      cssClass: 'custom-modal',
    });
    modal2.onDidDismiss().then((data) => {
      if (data.data.dismissed) {
        this.modalCodeMenu();
      }
    });
    return await modal2.present();
  }
  async presentToast(messages) {
    const toast = await this.toastController.create({
      message: messages,
      duration: 2000,
      position: 'top',
      color: 'success',
      cssClass: 'toast-controller2'
    });
    toast.present();
  }
  async presentToast2(messages) {
    const toast = await this.toastController.create({
      message: messages,
      duration: 2000,
      position: 'top',
      color: 'danger',
      cssClass: 'toast-controller'
    });
    toast.present();
  }
  moved(e) {
    if (this.menuControl === true) {
      this.menuControl = false;
    }
    const c = e.target.getCenter();

    const address = {
      lat: c.lat,
      lng: c.lng,
      api: this.apiKey
    };
    this.gps = c;

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
  segmentChanged(ebv){

  }
  onMapLoad( map: Map) {
    // i added
    map.resize()}


    checkProduct() {
      this.userService.getRunningHistory().subscribe((com11: HttpResponse<any>) => {
        console.log('5');
        if (com11.status === 200) {
          console.log('6');
          console.log(com11);
          console.log(com11.body.length>0);
          if (com11.body.length>0) {
            this.running = true;
            console.log('7');
            console.log(com11.body[0]);
            this.orderId = com11.body[0].id;
            this.process = true;
            /*if(localStorage.getItem('customer-lat') && localStorage.getItem('customer-time')){
              this.markerPosition2 = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
              this.center  = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
              this.userService.markerEvent1(this.markerPosition2);
              this.zoomis = 12;
              this.markerPosition = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
              this.time = localStorage.getItem('customer-time');
            } else {*/
            this.userService.checkOrder(this.orderId).subscribe((com2: any) => {
              console.log(com2);
              console.log('asd');
              this.orderProduct = com2;

              this.userService.checkCustomer(com2[0].centerid).subscribe((com3: any) => {


                let geom = com3[0].st_astext;
                let newtext = geom.slice(6);

                let num = newtext.indexOf(" ");
                let number1 = newtext.slice(0,num);

                let number2with = newtext.slice(num+1);


                let number2 = number2with.slice(0,number2with.indexOf(")"));

                let address ={
                  x: number1,
                  y: number2
                };

                this.customerProduct = {
                  name:com3[0].name,
                  phone:com3[0].phone,
                  x: number1,
                  y: number2
                };
                localStorage.setItem('customer-lat', number1);
                localStorage.setItem('customer-lng', number2);

                this.userService.getTimeNear(address).subscribe((com4: HttpResponse<any>) => {

                  if (com4.status === 200) {

                    let time = com4.body.routes[0].duration/60+15;

                    this.duration = {
                      time: time.toFixed(0),
                      distance: com4.body.routes[0].distance
                    };
                    if(!localStorage.getItem('customer-time')) {
                      localStorage.setItem('customer-time', this.duration.time);
                    }
                    this.userService.timeEvent1(this.time);
                    this.markerPosition2 = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
                    this.center  = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
                    this.userService.markerEvent1(this.markerPosition2);
                    this.zoomis = 12;
                    this.loading.dismiss();
                    this.markerPosition = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
                    this.time = localStorage.getItem('customer-time');



                  }
                }, err => {
                  this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
                  this.loading.dismiss();
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
              }, err => {
                this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
                this.loading.dismiss();
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
            }, err => {
              this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
              this.loading.dismiss();
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
            /*}*/


          } else {
            console.log('8');
            this.userService.getRunningHistory2().subscribe((com11: HttpResponse<any>) => {
              console.log('11');
              if (com11.status === 200) {
                console.log('12');
                console.log(com11);

                if (com11.body.length>0) {
                  this.running = false;
                  console.log('13');
                  this.orderId = com11.body[0].id;
                  this.process = true;
                  this.userService.checkOrder(this.orderId).subscribe((com2: any) => {

                    this.orderProduct = com2;

                    this.userService.checkCustomer(com2[0].centerid).subscribe((com3: any) => {


                      let geom = com3[0].st_astext;
                      let newtext = geom.slice(6);

                      let num = newtext.indexOf(" ");
                      let number1 = newtext.slice(0,num);

                      let number2with = newtext.slice(num+1);


                      let number2 = number2with.slice(0,number2with.indexOf(")"));

                      let address ={
                        x: number1,
                        y: number2
                      };

                      this.customerProduct = {
                        name:com3[0].name,
                        phone:com3[0].phone,
                        x: number1,
                        y: number2
                      };
                      localStorage.setItem('customer-lat', number1);
                      localStorage.setItem('customer-lng', number2);
                      this.markerPosition2 = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
                      this.center  = [+localStorage.getItem('customer-lat'), +localStorage.getItem('customer-lng')];
                      this.userService.markerEvent1(this.markerPosition2);
                      this.zoomis = 12;
                      this.loading.dismiss();
                      this.markerPosition = [+localStorage.getItem('long'), +localStorage.getItem('latitude')];
                    }, err => {
                      this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
                      this.loading.dismiss();
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
                  }, err => {
                    this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
                    this.loading.dismiss();
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
                  /*}*/


                } else {
                  this.process = false;

                  this.loading.dismiss();
                }

              }

            }, err => {
              this.loading.dismiss();
              if (err.status === 401 ) {
                this.process = false;
              }else {
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
              }


            });

          }

        }

      }, err => {
        this.loading.dismiss();
        if (err.status === 401 ) {
          this.process = false;
        }else {
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
        }


      });
    }
}
