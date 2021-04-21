import {AfterViewInit, Component, OnInit, ViewContainerRef} from '@angular/core';
import {ProductComponent} from './product/product.component';
import {AlertController, LoadingController, MenuController, ModalController, Platform} from '@ionic/angular';

import {Map} from '../shared/service/map';
import {SearchComponent} from './search/search.component';
import {loginRegister} from '../shared/service/login-register';
import { Plugins } from '@capacitor/core';
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AddComponent} from "../login/license/add/add.component";
import {HistoryPage} from "../history/history.page";
import {RunningComponent} from "../history/running/running.component";
const { Geolocation } = Plugins;



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  title = 'mapir-angular-test';
  location;
  flag = false;
  menuControl = false;
  errorMsg;
  subscription: Subscription;
  input;
  flagMenu =false;
  user;
  show =false;
  center: any ;
  markerPosition: any = [51.3380649, 35.700179] ;
  apiKey: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNkN2ZlMTI0ZDVmMjRkYTA3ZDlmMWQ5MzM4NjAwYTljZGQ2MDAzYTg4MGE3NGE2ZmViNDg3OTUwMGUyNzdiNzNhMDNjMzEzYjlhMTc2OTA3In0.eyJhdWQiOiIxMjkxOCIsImp0aSI6ImNkN2ZlMTI0ZDVmMjRkYTA3ZDlmMWQ5MzM4NjAwYTljZGQ2MDAzYTg4MGE3NGE2ZmViNDg3OTUwMGUyNzdiNzNhMDNjMzEzYjlhMTc2OTA3IiwiaWF0IjoxNjE0MDYwMjM5LCJuYmYiOjE2MTQwNjAyMzksImV4cCI6MTYxNjU2MjIzOSwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.VimkTn40KxmYGKafT9zCVLZM_TRtGmqIdhq8PSED76iirwTsp8tomdpxJP9qd77udTNnDB5NYybH15vV7kqTuLMjXUd8CsEIpH08SSnwsTP2JJmnu5EyTlMPsdiWnt7bQaE1JJd51swFP5vjP-7myp6yu0uD8rA94LMmY2wbF3fUljO5UKVWZeDBoYhvowssysWzicZAZDLKHji1DwftyPuCrziO3pEt5qldQiJrGVq7TgnzsKSugbK-Dhtjimdt-l_S-xnXnrtx7iIeTHKJfGKIDzEc6X8Xu1GqSi5nNHjSAzPdPEGG3xQNDCO7tO4DVeq3matk5rq8lhIwAcmFaw';
  constructor(private modalController: ModalController,
              private router: Router,
              private userService: loginRegister,
              private map: Map,
              private alertCtrl: AlertController,
              private viewContainerRef: ViewContainerRef,
              private loading: LoadingController,) { }
    async ngOnInit() {
      await this.userService.getUser().subscribe((com: any) => {
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
      });
      this.subscription = this.userService.recipeEvent.subscribe(
        (recipes)=>{
          console.log('subject');
          console.log(recipes);
          this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
            load.present();
            this.userService.getUser().subscribe((com: any) => {
              if (com.status === 200) {
                this.user = com.body;
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

          });
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
    localStorage.setItem('addressFull', this.input);
    const modal2 = await this.modalController.create({
      component: ProductComponent,
      cssClass: 'custom-modal',
    });
    modal2.onDidDismiss().then((data) => {
      console.log("exittttt");
    });
    return await modal2.present();
  }
  async modalSearch(){
    if (this.menuControl === true) {
      this.menuControl = false;
    }
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'custom-modal2'
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
  clickMenu() {
    this.menuControl = !this.menuControl;
  }
  clickMap() {
  }
  exit() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/', 'register-login']);
  }


  onMapLoaded(event) {
    console.log('event');
    console.log(event);
    event.map.resize();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.show = true;
      console.log('salam');
      this.markerPosition = [51.338064963919834, 35.70017923069952];
      this.center = [51.338064963919834, 35.70017923069952];
      this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
        load.present();
        if (localStorage.getItem('latitude')) {
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
        } else {
          const address = {
            lat: '35.70017923069952',
            lng: '51.338064963919834',
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
        this.loading.dismiss();
      });


      if (localStorage.getItem('lat')) {
        localStorage.removeItem('lng');
        localStorage.removeItem('lat');
        localStorage.removeItem('address');


      }

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
      cssClass: 'custom-modal2',
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
      component: RunningComponent,
      cssClass: 'custom-modal2'
    });
    return await modal.present();
  }
  async edit(){
    if (this.menuControl === true) {
      this.menuControl = false;
    }
    const modal = await this.modalController.create({
      component: RunningComponent,
      cssClass: 'custom-modal2'
    });
    return await modal.present();
  }
}
