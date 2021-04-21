import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertController, LoadingController, ModalController, NavParams, ToastController} from "@ionic/angular";
import {loginRegister} from "../../../shared/service/login-register";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
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
  carName;
  mode2;
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
  brands: any = [
    {
      "id": 81,
      "name": "سایپا",
      "slug": "pa_saipa"
    },
    {
      "id": 82,
      "name": "ایران خودرو",
      "slug": "pa_irankhodro"
    },
    {
      "id": 95,
      "name": "آلفارومئو",
      "slug": "pa_alfaromeo"
    },
    {
      "id": 83,
      "name": "آئودی",
      "slug": "pa_audi"
    },
    {
      "id": 121,
      "name": "بنز",
      "slug": "pa_benz"
    },
    {
      "id": 120,
      "name": "بی ام و",
      "slug": "pa_bmw"
    },
    {
      "id": 94,
      "name": "چانگان",
      "slug": "pa_changan"
    },
    {
      "id": 90,
      "name": "چری",
      "slug": "pa_chery"
    },
    {
      "id": 104,
      "name": "سیتروئن",
      "slug": "pa_citroen"
    },
    {
      "id": 85,
      "name": "دی اس",
      "slug": "pa_ds"
    },
    {
      "id": 88,
      "name": "جیلی",
      "slug": "pa_geely"
    },
    {
      "id": 89,
      "name": "هاوال",
      "slug": "pa_haval"
    },
    {
      "id": 93,
      "name": "جک",
      "slug": "pa_jack"
    },
    {
      "id": 118,
      "name": "کیا",
      "slug": "pa_kia"
    },
    {
      "id": 108,
      "name": "لکسوس",
      "slug": "pa_lexus"
    },
    {
      "id": 105,
      "name": "لیفان",
      "slug": "pa_lifan"
    },
    {
      "id": 97,
      "name": "مازاراتی",
      "slug": "pa_maserati"
    },
    {
      "id": 110,
      "name": "مزدا",
      "slug": "pa_mazda"
    },
    {
      "id": 86,
      "name": "ام جی",
      "slug": "pa_mg"
    },
    {
      "id": 114,
      "name": "مینی",
      "slug": "pa_mini"
    },
    {
      "id": 111,
      "name": "میتسوبیشی",
      "slug": "pa_mitsubishi"
    },
    {
      "id": 107,
      "name": "ام وی ام",
      "slug": "pa_mvm"
    },
    {
      "id": 112,
      "name": "نیسان",
      "slug": "pa_nissan"
    },
    {
      "id": 113,
      "name": "اپل",
      "slug": "pa_opel"
    },
    {
      "id": 84,
      "name": "پژو",
      "slug": "pa_peugeot"
    },
    {
      "id": 87,
      "name": "پورشه",
      "slug": "pa_porsche"
    },
    {
      "id": 91,
      "name": "رنو",
      "slug": "pa_renault"
    },

    {
      "id": 116,
      "name": "سانگ یانگ",
      "slug": "pa_ssangyong"
    },
    {
      "id": 117,
      "name": "سوزوکی",
      "slug": "pa_suzuki"
    },
    {
      "id": 92,
      "name": "تویوتا",
      "slug": "pa_toyota"
    },
    {
      "id": 119,
      "name": "فولکس واگن",
      "slug": "pa_volkswagen"
    },
    {
      "id": 109,
      "name": "ولوو",
      "slug": "pa_volvo"
    },
    {
      "id": 122,
      "name": "هیوندای",
      "slug": "pa_hiyonday"
    },
    {
      "id": 123,
      "name": "هوندا",
      "slug": "pa_honda"
    },
  ];
  constructor(private alertCtrl: AlertController,
              private userService: loginRegister,
              private loading: LoadingController,
              private router: Router,
              private route: ActivatedRoute,
              private navParams: NavParams,
              public modalCtrl: ModalController,
              private toastController: ToastController) { }
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
      this.userService.getCarName().subscribe((com: HttpResponse<any>) => {
        if (com.status === 200) {
          console.log(com);
          this.carName= com.body[0].name;

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
    this.form = new FormGroup({
      company: new FormControl('0', [Validators.required]),
      model: new FormControl('0', [Validators.required]),
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
  onChange(e) {
    if (e.target.value !== '0') {
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
      this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
        load.present();
        console.log(e.target.value);
        for (let i = 0 ; i< this.brands.length; i++) {
          if (this.brands[i].id === +e.target.value) {
            this.company = this.brands[i].slug;
          } else {

          }
        }

        this.listModels = [{id: '0', name: 'مدل خودرو'}];
        this.userService.getCar(e.target.value).subscribe((com: HttpResponse<any>) => {

          for (let i = 0; i < com.body.length; i++)
            this.listModels.push(com.body[i]);
          this.loading.dismiss();
          this.form.get('model').patchValue('0');
        }, err => {
          this.errorMsg = 'خطا در ورود به سامانه:' + err.status;
          this.alertCtrl.create({
            message: 'خطا در ورود به سامانه', buttons: [
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

    } else {
      this.listModels = [{id: '0', name: 'مدل خودرو'}];
    }
  }
  setCar() {
    this.loading.create({message: 'لطفا صبر کنید ...', keyboardClose: true}).then(load => {
      load.present();
      if (this.form.controls.company.value === '0'){
        this.loading.dismiss();
        this.alertCtrl.create({
          message: 'کمپانی خودرو را وارد کنید', buttons: [
            {
              text: 'تایید',
              role: 'cancel'
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });

      } else if (this.form.controls.model.value === '0') {
        this.loading.dismiss();
        this.alertCtrl.create({
          message: 'مدل خودرو را وارد کنید', buttons: [
            {
              text: 'تایید',
              role: 'cancel'
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      } else if (this.form.value.plate.plate2 === 'انتخاب کنید') {
        this.loading.dismiss();
        console.log('11111111');
        this.alertCtrl.create({
          message: 'پلاک خودرو را وارد کنید', buttons: [
            {
              text: 'تایید',
              role: 'cancel'
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      } else if (!this.form.valid) {
        if (this.form.controls.company.value === '0'){
          this.loading.dismiss();
          this.alertCtrl.create({
            message: 'کمپانی خودرو را وارد کنید', buttons: [
              {
                text: 'تایید',
                role: 'cancel'
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });

        } else if (!this.form.controls.model.valid) {
          this.loading.dismiss();
          this.alertCtrl.create({
            message: 'مدل خودرو را وارد کنید', buttons: [
              {
                text: 'تایید',
                role: 'cancel'
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        } else if (!this.form.controls.plate.valid) {
          this.loading.dismiss();
          console.log('22222222222222');
          console.log(this.form);
          this.alertCtrl.create({
            message: 'پلاک خودرو را وارد کنید', buttons: [
              {
                text: 'تایید',
                role: 'cancel'
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        }
      } else {
        localStorage.setItem('car_id', this.form.value.model);
        localStorage.setItem('company', this.company);
        localStorage.setItem('company_id', this.form.value.company);

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
                this.modalCtrl.dismiss();

              }else {
                this.router.navigate(['/', 'location-permision']);
                this.modalCtrl.dismiss();
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
    this.modalCtrl.dismiss();
  }
}
