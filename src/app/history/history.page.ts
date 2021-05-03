import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  flag = true;

  constructor(private router: Router, public modalCtrl: ModalController) {
  }

  ngOnInit() {
  }



  backClick() {
    this.modalCtrl.dismiss({
      'dismissed': false

    });
  }
  segmentChanged($event) {
    console.log($event.detail.value);
    if ($event.detail.value === 'running') {
      this.flag = true;
    } else if ($event.detail.value === 'completed') {
      this.flag = false;
    }
  }
}
