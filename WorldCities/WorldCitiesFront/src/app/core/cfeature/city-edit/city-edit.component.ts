import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { City } from 'src/app/models/city';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent implements OnInit {

  // the view title
  title?: string;
  // the form model
  form!: FormGroup;
  // the city object to edit
  city?: City;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      lat: new FormControl(''),
      lon: new FormControl('')
    })

    this.loadData()

  }

  loadData() {
    // retrieve the ID from the 'id' parameter
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    var id = idParam ? +idParam : 0;

    this.apiService.getDataById('Cities', id).subscribe(
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
  }

  onSubmit() {
    var city = this.city;
    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      var url = environment.apiUrl + 'api/Cities/' + city.id;

      this.apiService
        .editDataById('Cities', city)
        .subscribe({
          next: (response) => {
            console.log(`Cidade ${city?.id} atualizada`)
            this.router.navigate(['/cities'])
          }, 
          error: (error) => console.error("Erro ao editar cidade: ", error)
        })
    }
  }

}
