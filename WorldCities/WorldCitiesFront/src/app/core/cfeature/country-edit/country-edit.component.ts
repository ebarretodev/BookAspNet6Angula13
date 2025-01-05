import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Country } from 'src/app/models/country';
import { BaseFormComponent } from '../../components/base-form.component';
import { CountryService } from '../countries/country.service';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.scss']
})
export class CountryEditComponent extends BaseFormComponent implements OnInit {
  // the view title
  title?: string;
  // the form model
  //form!: FormGroup;
  // the country object to edit or create
  country?: Country;
  // the country object id, as fetched from the active route:
  // It's NULL when we're adding a new country,
  // and not NULL when we're editing an existing one.
  id?: number;
  // the countries array for the select
  countries?: Country[];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    //private http: HttpClient,
    private countryService: CountryService

  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDupeField("name")],
      iso2: ['', [Validators.required,Validators.pattern(/^[a-zA-Z]{2}$/)],this.isDupeField("iso2")],
      iso3: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{3}$/)
        ],
        this.isDupeField("iso3")
      ]
    });
    this.loadData()
  }

  loadData() {
    // retrieve the ID from the 'id' parameter
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    if (this.id) {
      // EDIT MODE
      // fetch the country from the server
      this.countryService.get(this.id)
      .subscribe({
        next: (response: Country)=>{
          this.country = response;
          this.title = "Edit - " + this.country.name;
          // update the form with the country value
          this.form.patchValue(this.country);},
        error: (error: any) => console.error("Erro ao buscar dados: ", error)
      });
    }
    else {
      // ADD NEW MODE
      this.title = "Create a new Country";
    }
  }

  onSubmit() {
    var country = (this.id) ? this.country : <Country>{};
    if (country) {
      country.name = this.form.controls['name'].value;
      country.iso2 = this.form.controls['iso2'].value;
      country.iso3 = this.form.controls['iso3'].value;
      if (this.id) {
        // EDIT mode
        // var url = environment.apiUrl + '/Countries/' + country.id;
        // this.http
        //   .put<Country>(url, country)
        this.countryService.put(country)
          .subscribe({
            next: (response: Country)=>{
              console.log("Country " + country!.id + " has been updated.");
            // go back to countries view
            this.router.navigate(['/countries'])},
            error: (error: any) => console.error(`Erro ao atualizar dados on ${country?.id}: `, error)
          })
      }
      else {
        // ADD NEW mode
        // var url = environment.apiUrl + '/Countries';
        // this.http
        //   .post<Country>(url, country)
        this.countryService.post(country)
        .subscribe({
          next: (response: Country)=>{
            console.log("Country " + response.id + " has been created.");
          // go back to countries view
          this.router.navigate(['/countries'])},
          error: (error: any) => console.error(`Erro ao criar ${country?.name}: `, error)
        })
      }
    }
  }


  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{
      [key: string]: any
    } | null> => {
      return this.countryService.isDupeField(
        this.id ?? 0,
        fieldName,
        control.value
      )
        .pipe(map(result => {
          return (result ? { isDupeField: true } : null);
        }));
    }
  }



}
