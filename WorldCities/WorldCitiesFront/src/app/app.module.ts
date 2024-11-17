import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavMenuComponent } from './core/components/nav-menu/nav-menu.component';
import { HomeComponent } from './core/cfeature/home/home.component';
import { CitiesComponent } from './core/cfeature/cities/cities.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material.module';
import { CountriesComponent } from './core/cfeature/countries/countries.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CityEditComponent } from './core/cfeature/city-edit/city-edit.component';
import { CountryEditComponent } from './core/cfeature/country-edit/country-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CitiesComponent,
    CountriesComponent,
    CityEditComponent,
    CountryEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
