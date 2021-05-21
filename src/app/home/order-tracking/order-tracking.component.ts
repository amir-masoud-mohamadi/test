import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavParams} from "@ionic/angular";
import {HttpResponse} from "@angular/common/http";
import {loginRegister} from "../../shared/service/login-register";

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
})
export class OrderTrackingComponent implements OnInit {

  constructor(private modalCtrl: ModalController,private alertCtrl: AlertController,private userService: loginRegister,private navparam: NavParams) { }
price;
  errorMsg;
  peyk;
  ngOnInit() {
    console.log(this.navparam);
    this.userService.peykOrder(this.navparam.data.product[0].peyk).subscribe((com4: HttpResponse<any>) => {
      console.log(com4);
      this.peyk = com4;

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
}
