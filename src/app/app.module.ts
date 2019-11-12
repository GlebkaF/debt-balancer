import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { BalancePageComponent } from './balance-page/balance-page.component';
import { AddPurchasePageComponent } from './add-purchase-page/add-purchase-page.component';
import { PayDebtPageComponent } from './pay-debt-page/pay-debt-page.component';


@NgModule({
  declarations: [
    AppComponent,
    BalancePageComponent,
    AddPurchasePageComponent,
    PayDebtPageComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
