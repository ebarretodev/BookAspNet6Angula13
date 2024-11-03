import { Component, OnInit, ViewChild } from '@angular/core';
import { City } from 'src/app/models/city';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
    this.apiService.getCities().subscribe({
      next: (response: City[])=>{
        this.cities = new MatTableDataSource<City>(response)
        this.cities.paginator = this.paginator
      },
      error: (error: any)=>{
        console.error('Erro ao buscar dados:', error)
      }
    })
  }

}
