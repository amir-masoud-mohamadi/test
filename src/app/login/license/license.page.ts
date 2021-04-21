import { Component, OnInit } from '@angular/core';
import {loginRegister} from '../../shared/service/login-register';
import {HttpResponse} from '@angular/common/http';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
@Component({
  selector: 'app-license',
  templateUrl: './license.page.html',
  styleUrls: ['./license.page.scss'],
})
export class LicensePage implements OnInit {
  errorMsg;
  carList;

  constructor(private alertCtrl: AlertController,
              private userService: loginRegister,
              private loading: LoadingController,
              private router: Router,
              private toastController: ToastController) { }
  ngOnInit() {
    this.userService.isCart().subscribe((com: HttpResponse<any>) => {
      if (com.status === 200) {
        if (com.body.success === '1'){
          this.carList = com.body.car;
        }
        if (com.body.success === '0') {

        } else if (com.body.success === '-1') {
          this.alertCtrl.create({
            message: com.body.message, buttons: [
              {
                text: 'تایید',
                role: 'cancel'
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
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
  }
  setCar(car) {
    const id = {
      car_id: +car.id
    };
    this.loading.create({message: 'لطفا صبر کنید ...', keyboardClose: true}).then(load => {
      load.present();
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
