import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeatherForecast } from 'src/app/share/models/weather-forecast.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  
  getData(){
    const apiUrl = environment.apiUrl

    return this.http.get<WeatherForecast[]>(`${apiUrl}/weatherforecast`)
  }
}
