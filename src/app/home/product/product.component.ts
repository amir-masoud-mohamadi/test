import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';

import {loginRegister} from '../../shared/service/login-register';
import {HttpResponse} from '@angular/common/http';
import {Params, Router} from "@angular/router";
import {ShopComponent} from "../shop/shop.component";


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
  numberRequest;
  loading = false;
  payment = false;
  address;
  listBaterryOne;
  product = true;
  listSearch = [];
  namayandegi;
  duration;
  flagBaterry = false;
  constructor(public modalCtrl: ModalController,
              private userService: loginRegister,
              private alertCtrl: AlertController,
              private router: Router,
              private loading2: LoadingController,
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
   batteryChoose(battery){

     localStorage.setItem('product_id', battery.id);

    /*this.dismiss();*/
    this.loading = true;
        this.userService.oneBattery().subscribe((com: HttpResponse<any>) => {
          if (com.status === 200) {
            this.listBaterryOne = com.body;
            let request = {
              address: localStorage.getItem('addressFull'),
              battryid: +localStorage.getItem('product_id'),
              token: localStorage.getItem('token'),
              centerid: '0',
              userid: +localStorage.getItem('id'),
              x: +localStorage.getItem('long'),
              y: +localStorage.getItem('lat'),
            };
            this.userService.createRequest(request).subscribe((com2: HttpResponse<any>) => {
              if (com2.status === 200) {
                console.log('salam');
                this.numberRequest = com2;
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
                        let time = com4.body.routes[0].duration/60+1;

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

  }
   loadingButton(){

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
        console.log('userInfo');
        console.log(this.user);
        let body = {
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
            let id = {
              "order_id": com2.body.id,
              "payment_method": "zarinpal_json",
              "callback_url": "http://localhost:8100/home"
            };
            console.log('com2');
            this.userService.paymentOrder(id).subscribe((com3: HttpResponse<any>) => {
              if (com3.status === 200) {
                if(com3.body.result) {
                  console.log(com3.body.redirect);
                  this.flagLoad = true;
                  /*this.router.navigate([com3.body.redirect])*/
                  window.location.href = com3.body.redirect;
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
}
