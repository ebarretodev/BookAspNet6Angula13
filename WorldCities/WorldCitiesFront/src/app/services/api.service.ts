import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Params } from '../models/params';
import { delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getData(dataType: string, paramsReceived: Params) {

    // Gera a chave de cache com base no tipo de dados e nos parâmetros.
    const cacheKey = `${dataType}_${JSON.stringify(paramsReceived)}`;
    const cachedData = localStorage.getItem(cacheKey);


    if (cachedData) {
      const currentTime = new Date().getTime()
      const cacheExpiryTime = 3600000; // 1 hora em milissegundos (3600 * 1000)
      const data = JSON.parse(cachedData)

      if (currentTime - data.timestamp < cacheExpiryTime) {
        console.log('Cache ainda válido');
        // Se os dados estiverem no localStorage, retorne os dados em cache.
        return of(data.response);  // Retorna os dados como um Observable.
      } else {
        console.log('Cache expirado');
        localStorage.removeItem('cacheTimestamp');
      }
    }

    let url = `${this.apiUrl}/${dataType}`;
    let params = new HttpParams()

    if (paramsReceived.pageEvent) {
      params = params
        .set("pageIndex", paramsReceived.pageEvent.pageIndex.toString())
        .set("pageSize", paramsReceived.pageEvent.pageSize.toString());
    }
    // Adiciona parâmetros de ordenação se estiverem presentes
    if (paramsReceived.sortValues) {
      params = params
        .set("sortColumn", paramsReceived.sortValues.sortColumn)
        .set("sortOrder", paramsReceived.sortValues.sortOrder || 'asc');
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

    return this.http.get<any>(url, { params }).pipe(
      tap(response => {
        let dataToCache = {
          response,
          timestamp: new Date().getTime()
        }
        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        console.log(`Dados armazenados no cache.`);
      })
    );
  }

  getDataById(dataType: string, id: number) {
    let url = `${this.apiUrl}/${dataType}/${id}`;
    return this.http.get<any>(url)
  }

  editDataById(dataType: string, data: any) {
    let url = `${this.apiUrl}/${dataType}/${data.id}`;
    this.clearCache()
    return this.http.put<any>(url, data)
  }

  insertDataById(dataType: string, data: any) {
    let url = `${this.apiUrl}/${dataType}`;
    this.clearCache()
    return this.http.post<any>(url, data)
  }

  clearCache() {
    localStorage.clear(); // Limpa todos os itens do localStorage
    console.log('Cache limpo');
  }

}
