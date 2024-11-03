import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { WeatherForecast } from './models/weather-forecast.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public forecasts?: WeatherForecast[] = [];
  
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe(
      response => {
        this.forecasts = response
      }, 
      error => {
        console.error('Erro ao buscar dados:', error);
      })
  }

  title = 'HealthCheck';
}

