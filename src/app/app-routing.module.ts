import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalancePageComponent } from './balance-page/balance-page.component';
import { AddPurchasePageComponent } from './add-purchase-page/add-purchase-page.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginPageComponent } from './login-page/login-page.component';



const routes: Routes = [  
  { path: 'balance', component: BalancePageComponent, canActivate: [AuthGuardService] }, 
  { path: 'add-purchase', component: AddPurchasePageComponent, canActivate: [AuthGuardService] }, 
  { path: 'pay-debt', component: AddPurchasePageComponent, canActivate: [AuthGuardService] }, 
  { path: 'login', component: LoginPageComponent },
  { path: '**', redirectTo: '/add-purchase',  pathMatch: 'full' },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
