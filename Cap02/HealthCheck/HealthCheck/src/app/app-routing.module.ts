import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FetchDataComponent } from './features/fetch-data/fetch-data.component';
import { HomeComponent } from './features/home/home.component';
import { HealthCheckComponent } from './features/health-check/health-check.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'fetch-data', component: FetchDataComponent },
    { path: 'health-check', component: HealthCheckComponent}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }