import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WeatherForecast } from '../models/weather-forecast.model';


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
