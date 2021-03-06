import { Component, OnInit } from '@angular/core';
import {HttpResponse} from "@angular/common/http";
import {loginRegister} from "../../shared/service/login-register";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.scss'],
})
export class DoneComponent implements OnInit {
  listDone;
  flagNo = true;
  flagBaterry = false;
  errorMsg;
  constructor(private userService: loginRegister,public modalCtrl: ModalController, private loading: LoadingController, private alertCtrl: AlertController) { }

   ngOnInit() {
    this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
      load.present();
      this.dis();

    });

  }
async dis() {
  await this.userService.getDoneHistory().subscribe((com: HttpResponse<any>) => {
    if (com.status === 200) {
      if (com.body.length>0) {
        this.flagNo = true;
        this.listDone = com.body;
        console.log(this.listDone);
        this.flagBaterry = true;
        this.loading.dismiss();
      } else {
        this.loading.dismiss();
        this.flagNo = false;
      }
    }
  }, err => {
    this.loading.dismiss();
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
}
