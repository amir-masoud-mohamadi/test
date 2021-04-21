import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import {ProductComponent} from './product/product.component';
import {RateComponent} from './rate/rate.component';
import {ReceiveComponent} from './receive/receive.component';
import {ShopComponent} from "./shop/shop.component";

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'rate',
    component: RateComponent
  },
  {
    path: 'receive',
    component: ReceiveComponent
  },

  {
    path: 'shop',
    component: ShopComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
