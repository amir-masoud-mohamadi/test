import { Component, OnInit } from '@angular/core';
import {HttpResponse} from "@angular/common/http";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {loginRegister} from "../../shared/service/login-register";
import {AddComponent} from "../../login/license/add/add.component";
import {ConfirmPage} from "../../login/confirm/confirm.page";
import {HistoryPage} from "../../history/history.page";
import {CodePage} from "../../login/code/code.page";

@Component({
  selector: 'app-peygiri',
  templateUrl: './peygiri.component.html',
  styleUrls: ['./peygiri.component.scss'],
})
export class PeygiriComponent implements OnInit {
  errorMsg;
  orderId = null;
  constructor(private alertCtrl: AlertController,private modalController: ModalController, private loading: LoadingController, private userService: loginRegister,) { }

  ngOnInit() {

  }

  loadingButton(){
    this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
      load.present();
      this.userService.getRunningHistory().subscribe((com11: HttpResponse<any>) => {
        console.log('11');
        if (com11.status === 200) {
          console.log('12');
          console.log(com11);
          console.log(com11.body[0].id);

          if (com11.body.length>0) {
            /*localStorage.getItem('sepideId')*/
            this.orderId = com11.body[0].id;
            if (this.orderId != null) {
              this.userService.updateOrder(this.orderId).subscribe((com12: HttpResponse<any>) => {
                console.log(com12);
                this.dismiss2();
              }, err => {
                this.dismiss2();
                this.loading.dismiss();
                if (err.status === 401 ) {

                }else {
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
                }


              });
            } else {

            }
          } else {
            console.log('com13');
            this.orderId = null;
          }
          this.loading.dismiss();
        }

      }, err => {
        this.loading.dismiss();
        if (err.status === 401 ) {

        }else {
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
        }


      });
    });

  }
  dismiss2() {
    this.modalController.dismiss({
      'dismissed': false
    });
  }
}
