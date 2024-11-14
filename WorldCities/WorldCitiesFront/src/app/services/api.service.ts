import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Sort } from '../models/city';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getCities(event: PageEvent, sort: Sort ) {
    var url = `${this.apiUrl}/Cities`
    var params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString())
      .set("sortColumn", sort.sortColumn)
      .set("sortOrder", sort.sortOrder)
    return this.http.get<any>(url, { params })
  }
}
