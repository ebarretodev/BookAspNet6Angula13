import { Component, OnInit, ViewChild } from '@angular/core';
import { City } from 'src/app/models/city';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  public cities!: MatTableDataSource<City>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = 0;
    pageEvent.pageSize = 10;
    this.getData(pageEvent)
    
  }

  getData(event: PageEvent){
    this.apiService.getCities(event).subscribe({
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
