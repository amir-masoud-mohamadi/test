import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {loginRegister} from "../../shared/service/login-register";
import {LoadingController, AlertController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import { Plugins } from '@capacitor/core';

const { Device } = Plugins;
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  form: FormGroup;
  errorMsg;
  mode;
  mode2;
  file;
  user;
  load = false;
  device: boolean;
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;
  constructor(
    private loading: LoadingController,
    private userService: loginRegister,
    private router: Router,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      avatar: new FormControl(null),
      nameImage: new FormControl(null),
    });
  }
  async ngOnInit() {
    this.loading.create({message: ' ... لطفا صبر کنید', keyboardClose: true}).then(load => {
      load.present();
      this.route.params.subscribe(
        (params: Params) =>{
          this.mode = params.update;
          console.log(params);
          if (this.mode === 'new') {
            this.mode2 = false;
            this.load = true;
            this.loading.dismiss();
          } else if (this.mode === 'update') {
            this.mode2 = true;
            console.log('params');
            this.userService.getUser().subscribe((com: any) => {
              if (com.status === 200) {
                this.user = com.body;
                this.load = true;
                this.loading.dismiss();
                console.log('user');
                console.log(this.user);

                this.form.patchValue(
                  {first_name: this.user.first_name,
                  last_name: this.user.last_name});
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
      );
    });

  }
  addRecipe(){

    if (this.form.value.first_name !== undefined && this.form.value.first_name !== null) {
      if (this.form.value.last_name !== undefined && this.form.value.last_name !== null) {
        this.loading.create({message: 'ذخیره سازی ...', keyboardClose: true}).then(load => {
          load.present();
          let send ;
          const formData = new FormData();
          if (this.mode2) {
            if (this.form.value.nameImage === null || this.form.value.nameImage === undefined) {
              formData.append('first_name', this.form.value.first_name);
              formData.append('last_name', this.form.value.last_name);
            } else {
              formData.append('first_name', this.form.value.first_name);
              formData.append('last_name', this.form.value.last_name);
              formData.append('avatar', this.file, this.file.name );
            }

          } else {
            formData.append('first_name', this.form.value.first_name);
            formData.append('last_name', this.form.value.last_name);
          }

          this.userService.updateUser(formData).subscribe((com: HttpResponse<any>) => {
            if (com.status === 200) {
                this.loading.dismiss();
              this.presentToast('اطلاعات ثبت شد');
              if (this.mode2) {
                this.router.navigate(['/', 'home']);
                this.userService.recipeEvent1();
              } else {
                this.router.navigate(['/', 'login', 'license', 'add-car', 'new']);
              }

            } else {
              this.loading.dismiss();
            }
          }, err => {
            this.loading.dismiss();
            this.errorMsg = err.error.message;
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
        });
      } else {
        this.presentToast2('لطفا نام خانوادگی را وارد کنید');
      }
    } else {
      this.presentToast2('لطفا نام را وارد کنید');
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
    if (this.mode2) {
      this.router.navigate(['/', 'home']);
    } else {

    }

  }
  clickButton() {
    this.clickInput();

  }
  clickInput(){}
  onPickImage() {
    this.filePicker.nativeElement.click();
    console.log('image');
  }
  /*onFileChoosen(e) {
   console.log(e);
   console.log(e.target.files[0].name);

   }*/
  onFileChoosen($event) {
    this.file = ($event.target.files as FileList).item(0);
    console.log('this.file');
    console.log(this.file);
    this.form.patchValue({nameImage: this.file.name})
  }
}
