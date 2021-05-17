import { Component, OnInit } from '@angular/core';
const { Network } = Plugins;
import { Plugins } from '@capacitor/core';
import {ModalController} from "@ionic/angular";
@Component({
  selector: 'app-network-disconnect',
  templateUrl: './network-disconnect.component.html',
  styleUrls: ['./network-disconnect.component.scss'],
})
export class NetworkDisconnectComponent implements OnInit {

  constructor(private modalController: ModalController) {


    let handler = Network.addListener('networkStatusChange', (status) => {
      console.log("Network status changed", status);
      if(status.connected === true) {
        this.modalController.dismiss({
          'dismissed': false
        });
      }
    });
  }

  ngOnInit() {}

}
