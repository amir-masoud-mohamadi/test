import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertController, LoadingController, ModalController, NavParams, ToastController} from "@ionic/angular";
import {loginRegister} from "../../../shared/service/login-register";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
import {ProductComponent} from "../../../home/product/product.component";
import {TownListPage} from "../town-list/town-list.page";
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  form: FormGroup;
  update;
  errorMsg;
  company;
  mode;
  companyId;
  carName;
  model;
  carId;
  mode2;
  companySlug;
  listCompany = [{id: '0', name: 'کمپانی خودرو'}];
  listModels = [{id: '0', name: 'مدل خودرو'}];
  plak = [
    {
      name: 'انتخاب کنید'
    },
    {
      name: 'الف'
    },
    {
      name: 'ب'
    },
    {
      name: 'پ'
    },
    {
      name: 'ت'
    },
    {
      name: 'ث'
    },
    {
      name: 'ج'
    },
    {
      name: 'چ'
    },
    {
      name: 'ح'
    },
    {
      name: 'خ'
    },
    {
      name: 'د'
    },
    {
      name: 'ذ'
    },
    {
      name: 'ر'
    },
    {
      name: 'ز'
    },
    {
      name: 'ژ'
    },
    {
      name: 'س'
    },
    {
      name: 'ش'
    }
    ,
    {
      name: 'ص'
    },
    {
      name: 'ض'
    },
    {

      name: 'ط'
    },
    {
      name: 'ظ'
    },
    {
      name: 'ع'
    },
    {
      name: 'غ'
    },
    {

      name: 'ف'
    },
    {

      name: 'ق'
    },
    {

      name: 'ک'
    },
    {
      name: 'گ'
    },
    {
      name: 'ل'
    },
    {
      name: 'م'
    },
    {
      name: 'ن'
    },
    {
      name: 'و'
    },
    {
      name: 'ه'
    },
    {
      name: 'ی'
    }
  ];

  constructor(private alertCtrl: AlertController,
              private userService: loginRegister,
              private loading: LoadingController,
              private router: Router,
              private route: ActivatedRoute,
              private navParams: NavParams,
              public modalCtrl: ModalController,
              private toastController: ToastController) {

  }
  ngOnInit() {
    console.log('update modal');
    if (this.navParams.data.update) {
      this.update = this.navParams.data.update;
    }
    console.log(this.update);
    if (this.update === 'new') {
      this.mode2 = false;
    } else if (this.update === 'update') {
      this.mode2 = true;

    }
    this.form = new FormGroup({
      company: new FormControl(null, [Validators.required]),
      model: new FormControl(null, [Validators.required]),
      plate: new FormGroup(
        {
          plate1: new FormControl(null, [Validators.required, Validators.minLength(2)]),
          plate2: new FormControl('null', [Validators.required]),
          plate3: new FormControl(null, [Validators.required, Validators.minLength(3)]),
          plate4: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        }
      )
    });
  }

  onChange(event) {
    console.log('event');
    console.log(event.target.value);


      /*this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
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
      });*/



  }
  setCar() {
    if (this.companyId && this.carId) {
      this.loading.create({message: 'لطفا صبر کنید ...', keyboardClose: true}).then(load => {
        load.present();
        if (this.form.controls.company.value === '0'){
          this.loading.dismiss();

          this.presentToast2('کمپانی خودرو را وارد کنید');
        } else if (this.form.controls.model.value === '0') {
          this.loading.dismiss();

          this.presentToast2('نوع خودرو را وارد کنید');
        } else if (this.form.value.plate.plate2 === 'انتخاب کنید') {
          this.loading.dismiss();
          console.log('11111111');
          this.presentToast2('پلاک خودرو را وارد کنید');
        } else if (!this.form.valid) {
          if (this.form.controls.company.value === '0'){
            this.loading.dismiss();
            this.presentToast2('کمپانی خودرو را وارد کنید');
          } else if (!this.form.controls.model.valid) {
            this.loading.dismiss();

            this.presentToast2('نوع خودرو را وارد کنید');
          } else if (!this.form.controls.plate.valid) {
            this.loading.dismiss();
            console.log('22222222222222');
            console.log(this.form);

            this.presentToast2('پلاک خودرو را وارد کنید');
          }
        } else {
          localStorage.setItem('car_id', this.carId);
          localStorage.setItem('company', this.companySlug);
          localStorage.setItem('company_id', this.companyId);

          console.log(this.form.value.plate);
          let plate = this.form.value.plate.plate1+ ',' + this.form.value.plate.plate3+ ','+ this.form.value.plate.plate4+ ',' + this.form.value.plate.plate2;
          console.log(plate);
          const formData = new FormData();
          formData.append('numberplate', plate);
          this.userService.updateUser(formData).subscribe((com: HttpResponse<any>) => {
            if (com.status === 200) {
              this.loading.dismiss();
              this.presentToast('اطلاعات ثبت شد');
              if (this.mode2) {
                this.modalCtrl.dismiss({
                  'dismissed': true,
                });

              }else {
                this.modalCtrl.dismiss({
                  'dismissed': true,
                });
              }



            } else {
            }
          }, err => {

            this.errorMsg = err.error.message;
            this.modalCtrl.dismiss();
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
        }
        /*if (this.form.valid) {

        } else {

        }*/
      });
    } else if(!this.companyId) {
      this.presentToast2(' کمپانی خودرو را وارد کنید');
    }else if(!this.carId) {
      this.presentToast2(' نوع خودرو را وارد کنید');
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
  backClick() {
    /*if (this.update === 'new') {
      localStorage.removeItem('token');
    }*/

    this.modalCtrl.dismiss({
      'dismissed': false
    });
  }

  async openModalCompany(e: boolean){
    const modal = await this.modalCtrl.create({
      component: TownListPage,
      cssClass: 'custom-modal',
      componentProps: {
        car: e
      }
    });
    modal.onDidDismiss().then((data) => {
      this.carId = undefined;
      this.form.patchValue({model: null});
      console.log("exittttt");

      if (data.data.dismissed) {
        console.log(data);
        console.log(data.data.select);
        this.form.patchValue({company: data.data.select.name});
        this.companyId = data.data.select.id;
        this.companySlug = data.data.select.slug;
      }
    });
    return await modal.present();
  }
  async openModalCar(e: boolean){
    if (this.companyId) {
      const modal = await this.modalCtrl.create({
        component: TownListPage,
        cssClass: 'custom-modal',
        componentProps: {
          car: e,
          id: this.companyId
        }
      });
      modal.onDidDismiss().then((data) => {
        if (data.data.dismissed) {
          this.carId = data.data.select.id;
          this.form.patchValue({model: data.data.select.name});
        }
      });
      return await modal.present();
    } else {
      this.presentToast2('ابتدا کمپانی خودرو را وارد کنید');
    }
  }
}
