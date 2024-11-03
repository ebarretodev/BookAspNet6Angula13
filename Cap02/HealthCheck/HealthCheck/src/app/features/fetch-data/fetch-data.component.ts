import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { WeatherForecast } from 'src/app/share/models/weather-forecast.model';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.css']
})
export class FetchDataComponent implements OnInit {
  public forecasts?: WeatherForecast[] = [];
  
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: (response: WeatherForecast[]) => {
        this.forecasts = response;
      },
      error: (error: any) => {
        console.error('Erro ao buscar dados:', error);
      },
    })
  }
}