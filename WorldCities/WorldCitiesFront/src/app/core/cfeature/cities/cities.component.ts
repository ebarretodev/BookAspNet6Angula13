import { Component, OnInit, ViewChild } from '@angular/core';
import { City, Filter, Params, Sort } from 'src/app/models/city';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  public cities!: MatTableDataSource<City>;

  defaultPageIndex: number = 0
  defaultPageSize: number = 10
  public defaultSortColumn: string = "name"
  public defaultSortOrder: "asc" | "desc" = "asc"

  defaultFilterColumn: string = "name";
  filterQuery?: string | null;
  paramsToSend: Params = {};


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.loadData()
  }

  loadData(query?: string) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent)
  }

  getData(event: PageEvent) {
    this.paramsToSend = {
      sortValues: {
        sortColumn: (this.sort) ? this.sort.active : this.defaultSortColumn,
        sortOrder: (this.sort) ? (this.sort.direction as 'asc' | 'desc') : this.defaultSortOrder
      }
    }

    

    var filterParams: Filter = {

      filterColumn: this.defaultFilterColumn,
    }

    if (this.filterQuery) {
      this.paramsToSend = {
        ...this.paramsToSend,
        filtersValues:{
          filterColumn: this.defaultFilterColumn,
          filterQuery: this.filterQuery
        }
      }
    }

    this.apiService.getCities(event, this.paramsToSend).subscribe({
      next: (response) => {
        this.paginator.length = response.totalCount
        this.paginator.pageIndex = response.pageIndex;
        this.paginator.pageSize = response.pageSize;
        this.cities = new MatTableDataSource<City>(response.data)
      },
      error: (error: any) => {
        console.error('Erro ao buscar dados:', error)
      }
    })
  }

}
