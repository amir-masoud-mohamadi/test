import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {HttpResponse} from '@angular/common/http';
import {DataModel3} from "./data-model3";
import {Router} from '@angular/router';
import {AlertController, LoadingController, ModalController, NavParams, ToastController} from '@ionic/angular';
import {loginRegister} from "../../../shared/service/login-register";

@Component({
  selector: 'app-town-list',
  templateUrl: './town-list.page.html',
  styleUrls: ['./town-list.page.scss'],
})
export class TownListPage implements OnInit {
  form: FormGroup;
  errorMsg;
  listTown: any;
  listTwo: any;
  text ;
  listModels;
  flag =false;
  flagTown =true;
  id;
  car: boolean;
  constructor(private userService: loginRegister,
              private router: Router,
              public modalCtrl: ModalController,
              private toastController: ToastController,
              private alertCtrl: AlertController,
              private loading: LoadingController,
              private navParams: NavParams) { }
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
  brandSearch = [
    {
      "id": -1,
      "name": "مدل خودرو",
      "slug": "test"
    }
  ];
  carSearch = [
    {
      "id": '-1',
      "name": "مدل خودرو"
    }
  ];
  ngOnInit() {
    if (this.navParams.data.car) {
      this.car = this.navParams.data.car;
      this.id = this.navParams.data.id
    }
    if (this.car) {

      this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
        load.present();

        /*for (let i = 0 ; i< this.brands.length; i++) {
          if (this.brands[i].id === +event.target.value) {
            this.company = this.brands[i].slug;
          } else {

          }
        }*/


        this.userService.getCar(this.id).subscribe((com: HttpResponse<any>) => {


            this.listModels = com.body;
          this.loading.dismiss();
          console.log(this.listModels);
        }, err => {
          this.loading.dismiss();
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
    }
        this.form = new FormGroup({
          town: new FormControl(null, Validators.required)
        });
  }
  segmentChanged(event){
    this.flagTown = true;
    console.log('flagTown1');
    console.log(this.flagTown);
    if(this.text = '') {

      this.brandSearch = [{
        "id": -1,
        "name": "مدل خودرو",
        "slug": "test"
      }];
      this.flag = false;

    } else {
      this.brandSearch = [{
        "id": -1,
        "name": "مدل خودرو",
        "slug": "test"
      }];
      console.log('111111');
      console.log(this.brandSearch);
      console.log(this.brands);
      for (let i=0; i< this.brands.length; i++) {
        if(this.brands[i].name.indexOf(event.target.value)> -1) {
          console.log('search');
          console.log(this.brandSearch[i]);
          this.flag = true;

          this.brandSearch.push(this.brands[i]);

        } else {


        }
      }
      console.log('flagTown1234');

      if(this.brandSearch.length == 1 || this.brandSearch.length == 0){
        console.log('flagTown2');
        console.log(this.flagTown);
        this.flagTown = false;
        console.log('flagTown3');
        console.log(this.flagTown);
      }
      this.brandSearch.splice(0,1);
    }
  }
  segmentChanged2(event){
    this.flagTown = true;
    console.log('flagTown1');
    console.log(this.flagTown);
    if(this.text = '') {

      this.carSearch = [{id:'-1', name: 'ads'}];
      this.flag = false;

    } else {
      this.carSearch = [{id:'-1', name: 'ads'}];

      for (let i=0; i< this.listModels.length; i++) {
        if(this.listModels[i].name.indexOf(event.target.value)> -1) {

          this.flag = true;

          this.carSearch.push(this.listModels[i]);

        } else {


        }
      }
      console.log('flagTown1234');
      console.log(this.carSearch.length);
      if(this.carSearch.length == 1 || this.carSearch.length == 0){
        console.log('flagTown2');
        console.log(this.flagTown);
        this.flagTown = false;
        console.log('flagTown3');
        console.log(this.flagTown);
      }
      this.carSearch.splice(0,1);
    }
  }
  onClickTown(event){
    this.modalCtrl.dismiss({
      'dismissed': true,
      'select': event
    });

  }
  onClickTown2(event){
    this.modalCtrl.dismiss({
      'dismissed': true,
      'select': event
    });

  }
  backClick() {
    /*if (this.update === 'new') {
      localStorage.removeItem('token');
    }*/

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
}
