import { Component, OnInit } from '@angular/core';
import {HttpResponse} from "@angular/common/http";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
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
  flag= true;
  constructor(private userService: loginRegister,public modalCtrl: ModalController, private loading: LoadingController, private alertCtrl: AlertController) { }

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
        let date1;
        let date2;
        let date3;
        let date4;
        let date5;
        for (let i = 0; i<this.listRunning.length; i++) {
          date1 = this.listRunning[i].date_created.toString().slice(0,4);
          date2 = this.listRunning[i].date_created.toString().slice(5,7);
          date3 = this.listRunning[i].date_created.toString().slice(8,10);
          date4 = new Date(+date1,+date2, +date3).toLocaleDateString('fa-Ir');
          date5 = this.listRunning[i].date_created.toString().slice(11,16);
          this.listRunning[i].date_created = date4;
          this.listRunning[i].date_modified = date5;
        }
        console.log(date1);
        console.log(date2);
        console.log(date3);
        console.log(date4);
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
  doneClick() {
    this.flag = true;
  }
  runClick() {
    this.flag = false;
  }
}
