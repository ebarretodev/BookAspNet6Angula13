import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { City } from 'src/app/models/city';
import { Country } from 'src/app/models/country';
import { BaseFormComponent } from '../../components/base-form.component';
import { CityService } from '../cities/city.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss'],
})
export class CityEditComponent extends BaseFormComponent implements OnInit, OnDestroy {
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
  countries?: Observable<Country[]>;

  production = environment.production;

  // Activity Log (for debugging purposes)
  activityLog: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cityService: CityService
  ) {
    super();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        lat: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/),
        ]),
        lon: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/),
        ]),
        countryId: new FormControl('', Validators.required),
      },
      null,
      this.isDupeCity()
    );

    // react to form changes
    this.subscriptions.add(
      this.form.valueChanges.subscribe(() => {
        if (!this.form.dirty) {
          this.log('Form Model has been loaded.');
        } else {
          this.log('Form was updated by the user.');
        }
      })
    );

    // react to changes in the form.name control
    this.subscriptions.add(
      this.form.get('name')!.valueChanges.subscribe(() => {
        if (!this.form.dirty) {
          this.log('Name has been loaded with initial values.');
        } else {
          this.log('Name was updated by the user.');
        }
      })
    );

    this.loadData();
  }

  log(str: string) {
    var log = '[' + new Date().toLocaleString() + '] ' + str
    this.activityLog +=  log + '<br />';
    console.log(log)
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
      this.cityService.get(this.id).subscribe({
        next: (response: City) => {
          this.city = response;
          this.title = 'Edit - ' + this.city.name;
          // update the form with the city value
          this.form.patchValue(this.city);
        },
        error: (error: any) => console.error('Erro ao buscar dados: ', error),
      });
    } else {
      // INSERT MODE
      this.title = 'Create a new City';
    }
  }

  loadCountries() {
    this.countries = this.cityService
      .getCountries(0, 9999, 'name', 'asc', null, null)
      .pipe(map(x => x.data))
      // .subscribe({
      //   next: (response: any) => (this.countries = response.data),
      //   error: (error: any) =>
      //     console.error(`Erro no fecth do Countries: ${error}`),
      // });
  }

  onSubmit() {
    let city = this.city ? this.city : <City>{};
    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      if (this.id) {
        //EDIT MODE
        this.cityService.put(city).subscribe({
          next: (response) => {
            console.log(`Cidade ${city?.id} atualizada`);
            this.router.navigate(['/cities']);
          },
          error: (error) => console.error('Erro ao editar cidade: ', error),
        });
      } else {
        this.cityService.post(city).subscribe({
          next: (response) => {
            console.log(`Cidade ${response.id} criada com sucesso`);
            this.router.navigate(['/cities']);
          },
          error: (error) => console.error('Erro ao criar cidade: ', error),
        });
      }
    }
  }

  isDupeCity(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      var city = <City>{};
      city.id = this.id ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      return this.cityService.isDupeCity(city).pipe(
        map((result) => {
          return result ? { isDupeCity: true } : null;
        })
      );
    };
  }
}


