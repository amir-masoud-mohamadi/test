import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';
import {async} from 'q';
import { Plugins } from '@capacitor/core';
import {ToastController} from "@ionic/angular";
const { Toast } = Plugins;
@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.page.html',
  styleUrls: ['./register-login.page.scss'],
})
export class RegisterLoginPage implements OnInit {

  constructor(private router: Router) { }

  async ngOnInit() {
  }


}
