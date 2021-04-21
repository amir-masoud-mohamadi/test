import { Component, OnInit } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  flagClass = true;
  constructor(private toastController: ToastController) { }
  ngOnInit() {
  }
  clickpayment(){
    if(this.flagClass) {
      return;
    } else {
      this.flagClass = true;
    }
  }
  clickpayment2(){
    if(!this.flagClass) {
      return;
    } else {
      this.flagClass = false;
    }
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
