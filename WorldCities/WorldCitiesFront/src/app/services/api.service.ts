import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Params } from '../models/params';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getData(dataType: string, event: PageEvent, paramsReceived: Params) {
    let url = `${this.apiUrl}/${dataType}`;
    let params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString());

    // Adiciona parâmetros de ordenação se estiverem presentes
    if (paramsReceived.sortValues) {
      params = params
        .set("sortColumn", paramsReceived.sortValues.sortColumn)
        .set("sortOrder", paramsReceived.sortValues.sortOrder);
    }

    // Adiciona parâmetros de filtro se estiverem presentes
    if (paramsReceived.filtersValues) {
      if (paramsReceived.filtersValues.filterColumn) {
        params = params.set("filterColumn", paramsReceived.filtersValues.filterColumn);
      }
      if (paramsReceived.filtersValues.filterQuery) {
        params = params.set("filterQuery", paramsReceived.filtersValues.filterQuery);
      }
    }

    return this.http.get<any>(url, { params });
  }

  getDataById(dataType: string, id: number){
    let url = `${this.apiUrl}/${dataType}/${id}`;
    return this.http.get<any>(url)
  }

  editDataById(dataType: string, data: any){
    let url = `${this.apiUrl}/${dataType}/${data.id}`;
    return this.http.put<any>(url, data)
  }

}
