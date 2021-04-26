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
  loading = false;
  payment = false;
  address;
  listBaterryOne;
  product = true;
  listSearch = [];
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
     console.log(battery);
     localStorage.setItem('product_id', battery.id);
    /*this.dismiss();*/
    this.loading = true;
        this.userService.oneBattery().subscribe((com: HttpResponse<any>) => {
          if (com.status === 200) {
            this.listBaterryOne = com.body;
            console.log('sa');
            console.log(this.listBaterryOne);
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
