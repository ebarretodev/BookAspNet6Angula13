import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavMenuComponent } from './core/components/nav-menu/nav-menu.component';
import { HomeComponent } from './core/cfeature/home/home.component';
import { CitiesComponent } from './core/cfeature/cities/cities.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material.module';
import { CountriesComponent } from './core/cfeature/countries/countries.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CityEditComponent } from './core/cfeature/city-edit/city-edit.component';
import { CountryEditComponent } from './core/cfeature/country-edit/country-edit.component';
import { CityService } from './core/cfeature/cities/city.service';
import { CountryService } from './core/cfeature/countries/country.service';
import { LoginComponent } from './core/cfeature/login/login.component';
import { AuthInterceptor } from './core/cfeature/auth/auth.interceptor';
import { RegisterComponent } from './core/cfeature/register/register.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ConnectionServiceModule, ConnectionServiceOptions, ConnectionServiceOptionsToken } from 'angular-connection-service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CitiesComponent,
    CountriesComponent,
    CityEditComponent,
    CountryEditComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ConnectionServiceModule
  ],
  providers: [
    CityService,
    CountryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: ConnectionServiceOptionsToken,
      useValue: <ConnectionServiceOptions>{
        heartbeatUrl: environment.apiUrl + '/heartbeat'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
