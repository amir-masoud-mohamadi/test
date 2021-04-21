import { Component, OnInit } from '@angular/core';
import {loginRegister} from '../../shared/service/login-register';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Map} from '../../shared/service/map';

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
              private map: Map) { }
  ngOnInit() {
    this.form = new FormGroup({
      town: new FormControl(null, Validators.required)
    });
  }
  segmentChanged(event){
    this.listSearch = [];
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
}
