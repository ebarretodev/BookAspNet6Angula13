import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Params } from 'src/app/models/params';
import { Country } from 'src/app/models/country';
import { ApiService } from 'src/app/services/api.service';
import { debounceTime, delay, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements AfterViewInit {
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

  filterTextChanged: Subject<string> = new Subject<string>()

  constructor(private apiService: ApiService) { }

  ngAfterViewInit(): void {
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
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    this.paramsToSend = {
      pageEvent: event,
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

    this.apiService.getData('Countries', this.paramsToSend)
    .pipe(
      delay(0)
    )
    .subscribe({
      next: (response: any) => {
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
