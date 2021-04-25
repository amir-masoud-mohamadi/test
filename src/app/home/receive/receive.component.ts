import { Component, OnInit } from '@angular/core';
import {HttpResponse} from "@angular/common/http";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {loginRegister} from "../../shared/service/login-register";

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
  errorMsg;
  listBaterry;
  constructor(private loading2: LoadingController,
              public modalCtrl: ModalController,
              private userService: loginRegister,
              private alertCtrl: AlertController) { }

  async ngOnInit() {
    await this.userService.oneBattery().subscribe((com: HttpResponse<any>) => {
      if (com.status === 200) {
        this.listBaterry = com.body;
        console.log('sa');
        console.log(this.listBaterry);

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
  backButton() {

  }
}
