import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string

  constructor(private http: HttpClient) { 
    this.apiUrl = environment.apiUrl;
  }

  getCities(){
    return this.http.get<City[]>(`${this.apiUrl}/Cities`)
  }
}
