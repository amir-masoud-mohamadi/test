import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationPermisionPageRoutingModule } from './location-permision-routing.module';

import { LocationPermisionPage } from './location-permision.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationPermisionPageRoutingModule
  ],
  declarations: [LocationPermisionPage]
})
export class LocationPermisionPageModule {}
