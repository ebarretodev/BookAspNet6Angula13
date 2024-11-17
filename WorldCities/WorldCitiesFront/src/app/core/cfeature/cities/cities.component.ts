import { Component, OnInit, ViewChild } from '@angular/core';
import { Params } from 'src/app/models/params';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { City } from 'src/app/models/city';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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

  filterTextChanged: Subject<string> = new Subject<string>()

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.loadData()
  }

  // debounce filter text changes
  onFilterTextChanged(filterText: string) {
    if (this.filterTextChanged.observers.length === 0) {
      this.filterTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
        });
    }
    this.filterTextChanged.next(filterText);
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

    if (this.filterQuery) {
      this.paramsToSend = {
        ...this.paramsToSend,
        filtersValues: {
          filterColumn: this.defaultFilterColumn,
          filterQuery: this.filterQuery
        }
      }
    }

    this.apiService.getData('Cities', event, this.paramsToSend).subscribe({
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
