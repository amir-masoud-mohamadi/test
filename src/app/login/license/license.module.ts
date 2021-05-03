import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicensePageRoutingModule } from './license-routing.module';

import { LicensePage } from './license.page';
import {AddComponent} from "./add/add.component";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicensePageRoutingModule,
    ReactiveFormsModule,


  ],
  declarations: [LicensePage, AddComponent]
})
export class LicensePageModule {}
