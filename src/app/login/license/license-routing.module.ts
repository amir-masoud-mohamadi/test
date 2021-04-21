import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicensePage } from './license.page';
import {AddComponent} from "./add/add.component";

const routes: Routes = [
  {
    path: '',
    component: LicensePage
  },
  {
    path: 'add-car/:update',
    component: AddComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicensePageRoutingModule {}
