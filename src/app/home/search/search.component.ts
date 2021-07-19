import { Component, OnInit } from '@angular/core';
import {loginRegister} from '../../shared/service/login-register';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Maps} from '../../shared/service/map';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  form: FormGroup;
  errorMsg;
  listSearch = [];
  listTown: [{id: string, name: string}];
  listTwo: [{id: string, name: string}] = [{id:'1', name: 'ads'}];
  text ;
  flag =false;
  flagTown =true;
  constructor(private userService: loginRegister,
              private router: Router,
              private alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private toastController: ToastController,
              private map: Maps) { }
  ngOnInit() {
    this.form = new FormGroup({
      town: new FormControl(null, Validators.required)
    });
  }
  segmentChanged(event){
    this.listSearch = [];
    let code = event.detail.value.toString();

    if (event.detail.value.toString().length < 2) {
    } else {
      const address = {
        text: event.detail.value,
        $filter: 'province eq تهران'
      };
      this.map.searchAddress(address).subscribe((com: any) => {
        this.listSearch = com.value;
      }, err => {
        this.errorMsg = 'خطا در سیستم:' + err.status;
        this.presentToast2(this.errorMsg);
      });
    }
  }
  onClickTown(event){
    localStorage.setItem('address', event.address);
    localStorage.setItem('lat', event.geom.coordinates[0]);
    localStorage.setItem('lng', event.geom.coordinates[1]);
    this.modalCtrl.dismiss(
      {message: 'close'}, 'close');
  }
  dismiss() {
    this.modalCtrl.dismiss(
      {message: 'close'}, 'close');
  }
  addRecipe() {

  }
  onKeypressEvent($event) {
    console.log($event);
    let find = null;
    find = $event.key;
    let code = find.charCodeAt(0);
    console.log(code);
    if (1575 <= code&& code <= 1576 || 1578 <= code && code <= 1594 || code === 1570 || code === 1662 || code === 1670|| code === 1601|| code === 1602|| code === 1705 || code === 1711 || 1604 <= code && code <= 1608 || code === 1740 || code === 1574 || code === 1688 || 1632 <= code && code <= 1641 || 48 <= code && code <= 57) {

    } else {
      this.presentToast2('لطفا حروف فارسی وارد نمایید');
      $event.preventDefault();
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
