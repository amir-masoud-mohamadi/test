import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';
import {LoadingController, AlertController, ToastController, ModalController} from '@ionic/angular';
import {loginRegister} from '../../shared/service/login-register';

import {HttpResponse} from '@angular/common/http';
@Component({
  selector: 'app-code',
  templateUrl: './code.page.html',
  styleUrls: ['./code.page.scss'],
})
export class CodePage implements OnInit {
  phoneNumber;
  id;
  lock = true;
  flag = false;
  form: FormGroup;
  errorMsg;
  flagLoad = true;
  constructor(
    private loading: LoadingController,
    private userService: loginRegister,
    private router: Router,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private toastController: ToastController,
    public modalCtrl: ModalController
    ) { }
   ngOnInit() {
    if (localStorage.getItem('phoneNumber') !== undefined && localStorage.getItem('phoneNumber') !== null) {
    this.phoneNumber = localStorage.getItem('phoneNumber');
    this.form = new FormGroup({
      code: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4) ]),

    });
    } else {
      this.router.navigate(['/', 'login']);
    }
  }
  addRecipe(){
    this.flagLoad = false;
    if (this.form.value.code === undefined || this.form.value.code === null) {
      this.presentToast2('لطفا کد را وارد کنید');
    } else {
        if (parseInt(this.form.value.code)){
          this.userService.getToken(this.form.value.code).subscribe((com: HttpResponse<any>) => {
            if (com.status === 200) {
                localStorage.setItem('token', com.body.token);
                localStorage.setItem('id', com.body.user_id);
                this.flagLoad = true;
                this.presentToast('خوش آمدید!');
                if (localStorage.getItem('type') === 'new') {
                  this.lock = false;
                  setTimeout(() => {
                    this.lock = true;
                    this.modalCtrl.dismiss({
                      'dismissed': true,
                      'type': 'new'
                    });
                  }, 2000)
                }else {
                  this.lock = false;
                  setTimeout(() => {
                    this.lock = true;
                    this.modalCtrl.dismiss({
                      'dismissed': true,
                      'type': 'update'
                    });
                  }, 2000)

                }

              }
          }, err => {
            this.flagLoad = true;
            this.errorMsg = err.error.message;

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
          this.flagLoad = true;
          this.presentToast('کد تایید معتبر نیست');

        }



    }





  }
  backClick() {
    this.modalCtrl.dismiss({
      'dismissed': false
    });
  }
  restart() {
    this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
      load.present();

          this.userService.generate(localStorage.getItem('phoneNumber')).subscribe((com: HttpResponse<any>) => {
            if (com.status === 200) {
              this.loading.dismiss();
              this.presentToast('کد تایید ارسال شد');
              this.router.navigate(['/', 'login', 'code']);
            } else {}


          }, err => {

            this.errorMsg = err.error.message;
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
