import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationPermisionPage } from './location-permision.page';

const routes: Routes = [
  {
    path: '',
    component: LocationPermisionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationPermisionPageRoutingModule {}
