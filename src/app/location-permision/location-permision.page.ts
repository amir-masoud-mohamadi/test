import { Component, OnInit } from '@angular/core';
import { Geolocation} from '@capacitor/core';
import {Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
import {LoadingController} from "@ionic/angular";
@Component({
  selector: 'app-location-permision',
  templateUrl: './location-permision.page.html',
  styleUrls: ['./location-permision.page.scss'],
})
export class LocationPermisionPage implements OnInit {

  constructor(private router: Router,
              private loading: LoadingController) { }

  ngOnInit() {
  }
  async clickGps() {
    this.loading.create({message: '...لطفا صبر کنید', keyboardClose: true}).then(load => {
      load.present();
      const position =  Geolocation.getCurrentPosition().then((resp) => {
        localStorage.setItem('latitude', resp.coords.latitude.toString());
        localStorage.setItem('long', resp.coords.longitude.toString());
        this.loading.dismiss();
        this.router.navigate(['/', 'home']);
      }).catch((err) => {
        this.loading.dismiss();
        this.router.navigate(['/', 'home']);
      });
    });


}
  closeClick(){
    this.router.navigate(['/', 'home'])
  }
}
