import { Component, OnInit } from '@angular/core';
import {HttpResponse} from "@angular/common/http";
import {AlertController, LoadingController} from "@ionic/angular";
import {loginRegister} from "../../shared/service/login-register";

@Component({
  selector: 'app-running',
  templateUrl: './running.component.html',
  styleUrls: ['./running.component.scss'],
})
export class RunningComponent implements OnInit {
  listRunning;
  flagBaterry;
  errorMsg;
  constructor(private userService: loginRegister,private loading: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
      load.present();
      this.dis();

    });

  }
  async dis() {
    await this.userService.getRunningHistory().subscribe((com: HttpResponse<any>) => {
      if (com.status === 200) {
        this.listRunning = com.body;
        console.log(this.listRunning);
        this.flagBaterry = true;
        this.loading.dismiss();
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
