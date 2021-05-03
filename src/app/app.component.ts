import {Component, ViewChild} from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AlertController, Platform} from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,) {
    this.initializeApp();

  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => this.splashScreen.hide(), 3000);
    });
  }

}
