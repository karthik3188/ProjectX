import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelfRegisterPage } from './self-register.page';

const routes: Routes = [
  {
    path: 'self-register',
    component: SelfRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelfRegisterPageRoutingModule {}
