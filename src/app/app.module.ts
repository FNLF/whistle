import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {WindowRef} from './pgp/WindowRef';

import { AppComponent } from './app.component';
import { PgpComponent } from './pgp/pgp.component';


@NgModule({
  declarations: [
    AppComponent,
    PgpComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [WindowRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
