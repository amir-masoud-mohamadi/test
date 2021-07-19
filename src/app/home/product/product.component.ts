import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, ModalController, Platform, ToastController} from '@ionic/angular';

import {loginRegister} from '../../shared/service/login-register';
import {HttpResponse} from '@angular/common/http';
import {Params, Router} from "@angular/router";
import {ShopComponent} from "../shop/shop.component";
import {DatePipe} from "@angular/common";
import {interval} from "rxjs/internal/observable/interval";
import {Subscription} from "rxjs/index";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  errorMsg;
  flagLoad = true;
  listBaterry;
  user;
  subscription: Subscription;
  numberRequest;
  loading = false;
  payment = false;
  address;
  idRequest;
  listBaterryOne;
  product = true;
  listSearch = [];
  namayandegi;
  pipe;
  timer;
  now;
  finish = false;
  fors = true;
  duration;
  times;
  orderId;
  flagBaterry = false;
  constructor(public modalCtrl: ModalController,
              private userService: loginRegister,
              private alertCtrl: AlertController,
              private router: Router,
              private loading2: LoadingController,
              private loading3: LoadingController,
              private platform: Platform,
              private toastController: ToastController
              ) {}
  async ngOnInit() {
    this.address = localStorage.getItem('addressFull');
    await this.userService.getBattery().subscribe((com: HttpResponse<any>) => {
      if (com.status === 200) {
        this.listBaterry = com.body;
        console.log('sa');
        console.log(this.listBaterry);
        this.flagBaterry = true;
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
  dismiss() {

    this.modalCtrl.dismiss(
      {message: 'close'}, 'close');
  }
  dismiss2() {
    this.loading3.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
      load.present();
      const id = {
        table: 'requesttbl',
        id:this.idRequest
      };
      this.userService.deleteRequest(id).subscribe((com33: any) => {
        this.loading3.dismiss();
        console.log(com33);
      }, err => {
        this.loading3.dismiss();

      });
    });
    clearInterval(this.timer);
    this.times = true;

    this.modalCtrl.dismiss(
      {message: 'close'}, 'close');
  }
   batteryChoose(battery){

     localStorage.setItem('product_id', battery.id);

    /*this.dismiss();*/
    this.loading = true;
     let body ;
     this.userService.getUser().subscribe((com: HttpResponse<any>) => {
       if (com.status === 200) {
         this.user = com.body;
         body = {
           "customer_id": this.user.id,
           "payment_method": "zarinpal_json",
           "set_paid": false,
           "shipping": {
             "first_name": this.user.first_name,
             "last_name": this.user.last_name,
             "address_1": localStorage.getItem('addressFull'),
             "address_2": "[ "+localStorage.getItem('latitude') +","+localStorage.getItem('long') +"]",
             "phone": this.user.name
           },
           "line_items": [
             {
               "product_id": localStorage.getItem('product_id'),
               "quantity": 1
             }
           ]
         };

         this.userService.createOrder(body).subscribe((com2: HttpResponse<any>) => {
           if (com2.status === 201) {
             console.log(com2);
             this.orderId= com2.body.id;
             this.pipe = new DatePipe('en-US');
             this.now = Date.now();
             let myShortFormat = this.pipe.transform(this.now, 'short');

             let request = {
               address: localStorage.getItem('addressFull'),
               battryid: +localStorage.getItem('product_id'),
               token: localStorage.getItem('token'),
               date: myShortFormat,
               centerid: '0',
               userid:this.user.id,
               orderid:this.orderId,
               username:this.user.name,
               customer_name:this.user.first_name+' '+this.user.last_name,
               price: this.listBaterry[0].price,
               batry_name: this.listBaterry[0].name,

               x: +localStorage.getItem('long'),
               y: +localStorage.getItem('latitude'),
             };

             console.log('this.orderId');
             console.log(this.orderId);
             this.userService.oneBattery().subscribe((com: HttpResponse<any>) => {
               if (com.status === 200) {
                 this.listBaterryOne = com.body;



                 this.userService.createRequest(request).subscribe((com2: HttpResponse<any>) => {
                   if (com2.status === 200) {
                     console.log('com2');
                     console.log(com2);
                     this.idRequest = com2.body;
                     this.timer = setInterval(() => {
                       console.log('interval');
                       this.userService.checkOrder(this.orderId).subscribe((com8: HttpResponse<any>) => {
                         if (com2.status === 200) {
                           console.log('com8');
                           console.log(com8);

                           if(com8[0].centerid !== 0 ) {


                             this.userService.getNear().subscribe((com3: HttpResponse<any>) => {
                               if (com3.status === 200) {
                                 console.log('salam3');

                                 this.namayandegi = com3.body;
                                 let geom = this.namayandegi.result.geom;
                                 let newtext = geom.slice(6);
                                 console.log('test string');
                                 console.log(newtext);
                                 let num = newtext.indexOf(" ");
                                 let number1 = newtext.slice(0,num);
                                 console.log(number1);
                                 console.log(newtext.slice(num+1));
                                 let number2with = newtext.slice(num+1);
                                 console.log(number2with.indexOf(")"));

                                 let number2 = number2with.slice(0,number2with.indexOf(")"));
                                 console.log(number2);
                                 let address ={
                                   x: number1,
                                   y: number2
                                 };
                                 localStorage.setItem('customer-lat', number1);
                                 localStorage.setItem('customer-lng', number2);
                                 this.userService.getTimeNear(address).subscribe((com4: HttpResponse<any>) => {
                                   if (com3.status === 200) {
                                     console.log('salam4');
                                     let time = com4.body.routes[0].duration/60+15;

                                     this.duration = {
                                       time: time.toFixed(0),
                                       distance: com4.body.routes[0].distance
                                     };
                                     localStorage.setItem('customer-time', this.duration.time);
                                     console.log(this.duration);
                                     this.product = false;
                                     this.loading = false;

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
                             clearInterval(this.timer);
                           }

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
                       if(this.times) {
                         console.log('just');
                         clearInterval(this.timer);
                       }
                     }, 10000);

                     console.log('request');
                     console.log(request);
                     this.numberRequest = com2;
                     /*do {
                       setTimeout(() => {
                         console.log('fgthfhfhfghfgthbfghfh');

                       },5000);
                     }
                     while (this.fors);*/


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

             console.log('com2');

           }
         }, err => {
           console.log('sepide === karajiye');
           this.flagLoad = true;

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
       }
     }, err => {
       console.log('sepide === mehdi');
       this.flagLoad = true;

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



  }
   loadingButton(){
     this.loading3.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
       load.present();
       const id = {
         table: 'requesttbl',
         id:this.idRequest
       };
       this.userService.deleteRequest(id).subscribe((com33: any) => {
         this.loading3.dismiss();
         console.log(com33);
       }, err => {


         this.loading3.dismiss();

       });
     });
     clearInterval(this.timer);

  /*this.dismiss();*/
  this.loading = false;
  this.product = true;



}
  cancelButton(){
    this.loading=false;
    this.product=true;
 }
  payButton(){
    this.flagLoad = false;
    this.userService.getUser().subscribe((com: HttpResponse<any>) => {
      if (com.status === 200) {
        this.user = com.body;
        let id;
        if(this.platform.is('desktop')) {
          id = {
            "order_id": this.orderId,
            "payment_method": "zarinpal_json",
            "callback_url": "https://geofahm.ir/tak/tak2.html?id="+this.orderId
          };
        } else {
          id = {
            "order_id": this.orderId,
            "payment_method": "zarinpal_json",
            "callback_url": "https://geofahm.ir/tak/tak.html?id="+this.orderId
          };
        }

        this.userService.paymentOrder(id).subscribe((com3: HttpResponse<any>) => {
          if (com3.status === 200) {
            if(com3.body.result) {
              console.log(com3.body.redirect);
              this.flagLoad = true;
              /*this.router.navigate([com3.body.redirect])*/
              window.location.href = com3.body.redirect;
              if(!this.platform.is('desktop')) {
                this.presentToast('close modal');
                this.dismiss();
              }
            }
            console.log('payment');

            console.log(com3);
          }
        }, err => {
          this.flagLoad = true;
          console.log('sepide === mamad');
          this.flagLoad = true;
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
      }
    }, err => {
      console.log('sepide === mehdi');
      this.flagLoad = true;

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
}
