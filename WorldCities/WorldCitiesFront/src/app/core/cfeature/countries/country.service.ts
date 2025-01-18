import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from 'src/app/models/country';
import { ApiResult, BaseService } from 'src/app/services/base.service';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CountryService
  extends BaseService<Country> {
  constructor(
    http: HttpClient,
  ) {
    super(http);
  }
  url = this.getUrl("Countries");

  headers = new HttpHeaders().set('Source', 'New Country Service')

  override getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null): Observable<ApiResult<Country>> {
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
    return this.http.get<ApiResult<Country>>(this.url, { params, headers: this.headers });
  }
  override get(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.url}/${id}`, { headers: this.headers });
  }

  override put(item: Country): Observable<Country> {
    return this.http.put<Country>(`${this.url}/${item.id}`, item, { headers: this.headers });
  }

  override post(item: Country): Observable<Country> {
    return this.http.post<Country>(this.url, item, { headers: this.headers });
  }

  isDupeField(countryId: number, fieldName: string, fieldValue: string):
    Observable<boolean> {
    var params = new HttpParams()
      .set("countryId", countryId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);
    return this.http.post<boolean>(`${this.url}/IsDupeField`, null, { params, headers: this.headers });
  }

}
