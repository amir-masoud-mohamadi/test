import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, ModalController, NavParams} from "@ionic/angular";
import {HttpResponse} from "@angular/common/http";
import {loginRegister} from "../../shared/service/login-register";
import {timer} from "rxjs/internal/observable/timer";
import {Subscription} from "rxjs/index";
import {interval} from "rxjs/internal/observable/interval";

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
})
export class OrderTrackingComponent implements OnInit {
  price;
  countDown:Subscription;
  counter = 120000;
  data;
  address = localStorage.getItem('addressFull');
  errorMsg;
  subscription: Subscription;
  tick = 60000;
  peyk;
  level1=true;
  level2=false;
  level3=false;
  time;
  orderId;
  final= false;
  finish: boolean = true;
  listBaterryOne;
  constructor(private modalCtrl: ModalController, private loading: LoadingController, private alertCtrl: AlertController,private userService: loginRegister,private navparam: NavParams) {
    console.log('this.navparam');
    console.log(this.navparam);
    this.data = this.navparam;
    console.log(this.data.data);
    console.log('this.navparam.data.product[0].peyk');
    console.log(this.navparam.data.product[0].peyk);
    console.log(this.navparam.data.orderId);
    this.orderId = this.navparam.data.orderId;
    this.userService.oneBattery().subscribe((com: HttpResponse<any>) => {
      if (com.status === 200) {

        this.listBaterryOne = com.body;
        console.log('this.listBaterryOne');
        console.log(this.listBaterryOne);
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

  async ngOnInit() {
    this.time = localStorage.getItem('customer-time');
    if (+localStorage.getItem('customer-time') === 0 ) {
      this.level3 = true;
      this.level1 = false;
      this.level2 = false;
      this.final = true;
      console.log('this.final');
      console.log(this.final);
    } else {
      this.subscription = this.userService.levelEvent.subscribe(
        (recipes)=> {


          console.log('recipes');
          console.log(recipes);
          if(+recipes>= 15) {
            if (+localStorage.getItem('customer-time') === 0 ) {
              this.level3 = true;
              this.level1 = false;
              this.level2 = false;
              this.final = true;
            } else {
              this.level3 = false;
              this.level1 = false;
              this.level2 = true;
            }
          } else {
            this.level3 = false;
            this.level1 = true;
            this.level2 = false;
          }

        });
    }
    this.subscription = this.userService.timeEvent.subscribe(
      (recipes)=> {


        this.time = recipes;

      });

    /*this.time = localStorage.getItem('customer-time');
    if (+this.time === 0) {
      this.finish = false;
    }
    this.countDown = timer(0, this.tick)
      .subscribe(() => {
        if (+this.time > 0) {

          if (this.time) {
            --this.time;
            localStorage.setItem('customer-time', this.time)
          }
        }
        if (+this.time === 0) {
          this.finish = false;
        }
      });*/

    await this.userService.peykOrder(this.navparam.data.product[0].peyk).subscribe((com4: HttpResponse<any>) => {
      console.log(com4);
      this.peyk = com4[0];

    }, err => {
      this.errorMsg = 'خطا در ورود به سامانه:' ;

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
    console.log(this.navparam);

  }
  backClick() {
    this.modalCtrl.dismiss({
      'dismissed': false
    });
  }
  finalButton() {
    this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
      load.present();

      let id = {
        status: 'completed'
      };
      this.userService.changeStatus(id, this.orderId).subscribe((com3: HttpResponse<any>) => {
        if (com3.status === 200) {


          this.loading.dismiss();
          this.modalCtrl.dismiss({
            'dismissed': false,
            'final': true
          });


          console.log(com3);
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
}
