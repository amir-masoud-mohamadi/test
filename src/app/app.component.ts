import {Component, ViewChild} from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AlertController, ModalController, Platform} from '@ionic/angular';
const { Network } = Plugins;
import { Plugins } from '@capacitor/core';

import {NetworkDisconnectComponent} from "./network-disconnect/network-disconnect.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private modalController: ModalController) {
    this.initializeApp();
    let handler = Network.addListener('networkStatusChange', (status) => {
      console.log("Network status changed", status);
      if(status.connected === false) {
        this.historyModal();
      }
    });

  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => this.splashScreen.hide(), 3000);
    });
  }
  async historyModal(){

    const modal = await this.modalController.create({
      component: NetworkDisconnectComponent,
      cssClass: 'custom-modal',
    });
    return await modal.present();
  }
}
