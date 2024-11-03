import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { FetchDataComponent } from './features/fetch-data/fetch-data.component';
import { NavMenuComponent } from './core/components/nav-menu/nav-menu.component';
import { AppRoutingModule } from './app-routing.module';
import { HealthCheckComponent } from './features/health-check/health-check.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FetchDataComponent,
    NavMenuComponent,
    HealthCheckComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
