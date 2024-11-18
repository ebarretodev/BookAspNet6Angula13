import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators'
import { City } from 'src/app/models/city';
import { Country } from 'src/app/models/country';
import { Params } from 'src/app/models/params';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { BaseFormComponent } from '../../components/base-form.component';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {

  // the view title
  title?: string;
  // the form model
  //form!: FormGroup;
  // the city object to edit or create
  city?: City;

  // the city object id, as fetched from the active route:
  // It's NULL when we're adding a new city,
  // and not NULL when we're editing an existing one.
  id?: number;

  // the countries array for the select
  countries?: Country[]

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private http: HttpClient
  ) { 
    super()
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', [Validators.required, Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)]),
      lon: new FormControl('', [Validators.required, Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)]),
      countryId: new FormControl('', Validators.required)

    }, null, this.isDupeCity())

    this.loadData()

  }

  loadData() {

    //load countries
    this.loadCountries();
    // retrieve the ID from the 'id' parameter
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    if (this.id) {
      // EDIT MODE:

      //Fetch from the server
      this.apiService.getDataById('Cities', this.id).subscribe(
        {
          next: (response: City) => {
            this.city = response
            this.title = "Edit - " + this.city.name
            // update the form with the city value
            this.form.patchValue(this.city)
          },
          error: (error: any) => console.error("Erro ao buscar dados: ", error)
        }
      )
    } else {
      // INSERT MODE
      this.title = "Create a new City"
    }

  }

  loadCountries() {
    // fetch all the countries from the server
    let url = environment.apiUrl + '/Countries';
    let params: Params = {
      pageEvent: {
        pageIndex: 0,
        pageSize: 9999
      },
      sortValues: {
        sortColumn: "name"
      }
    }
    
    this.apiService.getData('Countries', params).subscribe({
      next: (response: any) => this.countries = response.data,
      error: (error: any) => console.error(`Erro no fecth do Countries: ${error}`)
    })
  }

  onSubmit() {
    let city = (this.city) ? this.city : <City>{};
    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      if (this.id) {
        //EDIT MODE
        this.apiService
          .editDataById('Cities', city)
          .subscribe({
            next: (response) => {
              console.log(`Cidade ${city?.id} atualizada`)
              this.router.navigate(['/cities'])
            },
            error: (error) => console.error("Erro ao editar cidade: ", error)
          })
      } else {
        this.apiService
          .insertDataById('Cities', city)
          .subscribe({
            next: (response) => {
              console.log(`Cidade ${response.id} criada com sucesso`)
              this.router.navigate(['/cities'])
            },
            error: (error) => console.error("Erro ao criar cidade: ", error)
          })

      }
    }
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      var url = environment.apiUrl + '/Cities/IsDupeCity';
      return this.http.post<boolean>(url, city).pipe(map(result => {

        return (result ? { isDupeCity: true } : null);
      }));
    }
  }
}
