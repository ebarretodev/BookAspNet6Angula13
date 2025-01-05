import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Params } from 'src/app/models/params';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { City } from 'src/app/models/city';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CityService } from './city.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements AfterViewInit {
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon', 'countryName'];
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

  constructor(
    private cityService: CityService,
    private cdr: ChangeDetectorRef
  ) { }
 
  ngAfterViewInit(){
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
    this.cdr.detectChanges();
  }

  getData(event: PageEvent) {
    this.cityService.getData(
      event.pageIndex,
      event.pageSize,
      (this.sort) ? this.sort.active : this.defaultSortColumn,
      (this.sort) ? this.sort.direction : this.defaultSortOrder,
      (this.filterQuery) ? this.defaultFilterColumn : null,
      (this.filterQuery) ? this.filterQuery : null
    )
    .subscribe({
      next: (response: any) => {
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
