import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {loginRegister} from '../shared/service/login-register';
import {HttpResponse} from '@angular/common/http';
import {LoadingController, AlertController, ToastController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  errorMsg;
  ports: any ;
  port: any;
  lock = true;
  phone;
  flagLoad2 = true;
  flagLoad = true;
  constructor(
    private alertCtrl: AlertController,
    private userService: loginRegister,
    private loading: LoadingController,
    private router: Router,
    private toastController: ToastController,
    public modalCtrl: ModalController
  ) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      phone: new FormControl(null, [Validators.required]),
    });
    console.log(this.form);
  }
  addRecipe(){
    console.log(this.form);
    this.flagLoad = false;
    let myString= '0';
    myString += this.form.value.phone.toString();
    if (myString !== null && myString !== undefined) {
      if (myString.length === 11){
        let phone = myString;
        this.userService.generate(phone).subscribe((com: HttpResponse<any>) => {
          if (com.status === 200) {
            localStorage.setItem('phoneNumber', phone);
            /this.loading.dismiss();/
            this.presentToast('کد تایید ارسال شد');
            localStorage.setItem('type', com.body.user.type);

            /setTimeout(() =>  , 2000);/
            this.flagLoad = true;
            this.lock = false;

            setTimeout(() => {
              this.lock = true;
              this.modalCtrl.dismiss({
                'dismissed': true
              });
            }, 2000)
          } else {}
        }, err => {
          this.errorMsg = err.error.message;
          this.flagLoad = true;
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
        /this.loading.dismiss();/
        this.flagLoad = true;
        this.presentToast2('شماره تلفن معتبر نیست');
      }
    } else {
      /this.loading.dismiss();/
      this.flagLoad = true;
      this.presentToast2('شماره تلفن را وارد کنید');
    }
  }
  backClick() {
    this.modalCtrl.dismiss({
      'dismissed': false
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
  onChange(e) {
    console.log(e);
  }
}
