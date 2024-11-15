import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Params } from 'src/app/models/params';
import { Country } from 'src/app/models/country';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3']
  public countries!: MatTableDataSource<Country>
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;
  paramsToSend: Params = {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(query?: string) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    this.paramsToSend = {
      sortValues: {
        sortColumn: (this.sort) ? this.sort.active : this.defaultSortColumn,
        sortOrder: (this.sort) ? (this.sort.direction as 'asc' | 'desc') : this.defaultSortOrder
      }
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

    this.apiService.getData('Countries', event, this.paramsToSend).subscribe({
      next: (response) => {
        this.paginator.length = response.totalCount
        this.paginator.pageIndex = response.pageIndex;
        this.paginator.pageSize = response.pageSize;
        this.countries = new MatTableDataSource<Country>(response.data)
      },
      error: (error: any) => {
        console.error('Erro ao buscar dados:', error)
      }
    })
  }
}
