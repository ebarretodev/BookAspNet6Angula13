import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Params } from 'src/app/models/params';
import { Country } from 'src/app/models/country';
import { debounceTime, delay, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CountryService } from './country.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements AfterViewInit, OnInit, OnDestroy {
  public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3', 'totCities']
  public countries!: MatTableDataSource<Country>
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;
  paramsToSend: Params = {}


  private destroySubject = new Subject()
  isLoggedIn: boolean = false

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterTextChanged: Subject<string> = new Subject<string>()

  constructor(
    private countriesService: CountryService,
    private authService: AuthService
  ) {
    this.authService.authStatus
          .pipe(takeUntil(this.destroySubject))
          .subscribe( result => {
            this.isLoggedIn = result
          })
   }
  ngOnDestroy(): void {
    this.destroySubject.next(true)
    this.destroySubject.complete()
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated()
  }

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
    this.countriesService.getData(
      event.pageIndex,
      event.pageSize,
      (this.sort) ? this.sort.active : this.defaultSortColumn,
      (this.sort) ? this.sort.direction : this.defaultSortOrder,
      (this.filterQuery) ? this.defaultFilterColumn : null,
      (this.filterQuery) ? this.filterQuery : null
    )
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
