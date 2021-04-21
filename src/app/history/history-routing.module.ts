import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryPage } from './history.page';
import {RunningComponent} from "./running/running.component";
import {DoneComponent} from "./doone/done.component";
const routes: Routes = [
  {
    path: '',
    component: HistoryPage,
    children: [
      {
        path: '',
        redirectTo: 'running',
        pathMatch: 'full'
      },
      {
        path: 'done',
        component: DoneComponent
      },

      {
        path: 'running',
        component: RunningComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryPageRoutingModule {}
