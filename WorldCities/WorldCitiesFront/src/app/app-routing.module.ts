import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/cfeature/home/home.component';
import { CitiesComponent } from './core/cfeature/cities/cities.component';
import { CountriesComponent } from './core/cfeature/countries/countries.component';
import { CityEditComponent } from './core/cfeature/city-edit/city-edit.component';
import { CountryEditComponent } from './core/cfeature/country-edit/country-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'cities', component: CitiesComponent },
  { path: 'city/:id', component: CityEditComponent },
  { path: 'city', component: CityEditComponent },
  { path: 'countries', component: CountriesComponent },
  { path: 'country/:id', component: CountryEditComponent },
  { path: 'country', component: CountryEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
