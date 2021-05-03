import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TownListPageRoutingModule } from './town-list-routing.module';

import { TownListPage } from './town-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TownListPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TownListPage]
})
export class TownListPageModule {}
