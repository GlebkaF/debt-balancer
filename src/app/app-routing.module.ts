import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalancePageComponent } from './balance-page/balance-page.component';
import { AddPurchasePageComponent } from './add-purchase-page/add-purchase-page.component';



const routes: Routes = [  
  { path: 'balance', component: BalancePageComponent }, 
  { path: 'add-purchase', component: AddPurchasePageComponent }, 
  { path: 'pay-debt', component: AddPurchasePageComponent }, 
  { path: '**', redirectTo: '/add-purchase',  pathMatch: 'full' },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
