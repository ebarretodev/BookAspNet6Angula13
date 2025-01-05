import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from 'src/app/models/city';
import { Country } from 'src/app/models/country';
import { ApiResult, BaseService } from 'src/app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class CityService
  extends BaseService<City> {
  constructor(
    http: HttpClient
  ) {
    super(http);
  }

  url = this.getUrl("Cities");
  headers = new HttpHeaders().set('Source', 'New City Service')

  override getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null): Observable<ApiResult<City>> {
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);
    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }
    return this.http.get<ApiResult<City>>(this.url, { params, headers: this.headers });
  }

  override get(id: number): Observable<City> {
    return this.http.get<City>(`${this.url}/${id}`, { headers: this.headers });
  }
  override put(item: City): Observable<City> {
    return this.http.put<City>(`${this.url}/${item.id}`, item, { headers: this.headers });
  }
  override post(item: City): Observable<City> {
    return this.http.post<City>(this.url, item, { headers: this.headers });

  }

  getCountries(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<Country>> {
    var url = this.getUrl("Countries");
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);
    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }
    return this.http.get<ApiResult<Country>>(url, { params, headers: this.headers });
  }

  isDupeCity(item: City): Observable<boolean> {
    return this.http.post<boolean>(`${this.url}/isDupeCity`, item, {headers: this.headers});
  }
}
