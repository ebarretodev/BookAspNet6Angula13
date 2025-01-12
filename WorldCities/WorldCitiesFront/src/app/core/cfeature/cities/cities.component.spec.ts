import { ApiResult } from './../../../services/base.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitiesComponent } from './cities.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CityService } from './city.service';
import { City } from 'src/app/models/city';
import { of } from 'rxjs';

describe('CitiesComponent', () => {
  let component: CitiesComponent;
  let fixture: ComponentFixture<CitiesComponent>;

  beforeEach(async () => {
    // TODO: declare & initialize required providers
    // Create a mock cityService object with a mock 'getData' method
    let cityService = jasmine.createSpyObj<CityService>('CityService', [
      'getData',
    ]);

    // Configure the 'getData' spy method
    cityService.getData.and.returnValue(
      //return as observable with some test data
      of<ApiResult<City>>(<ApiResult<City>>{
        data: [
          <City>{
            name: 'TestCity1',
            id: 1,
            lat: 1,
            lon: 1,
            countryId: 1,
            countryName: 'TestCountry1',
          },
          <City>{
            name: 'TestCity2',
            id: 2,
            lat: 1,
            lon: 1,
            countryId: 1,
            countryName: 'TestCountry1',
          },
          <City>{
            name: 'TestCity3',
            id: 3,
            lat: 1,
            lon: 1,
            countryId: 1,
            countryName: 'TestCountry1',
          },
        ],
        totalCount: 3,
        pageIndex: 0,
        pageSize: 10,
      })
    );

    await TestBed.configureTestingModule({
      declarations: [CitiesComponent],
      imports: [
        BrowserAnimationsModule,
        AngularMaterialModule,
        RouterTestingModule,
      ],
      providers: [
        // TODO: reference required providers
        {
          provide: CityService,
          useValue: cityService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitiesComponent);
    component = fixture.componentInstance;

    // TODO: configure fixture/component/children/etc.
    component.paginator = jasmine.createSpyObj(
      "MatPaginator", ["length", "pageIndex", "pageSize"]
      );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: implement some other tests
  it('should display a "Cities" title', () => {
    let title = fixture.nativeElement
    .querySelector('h1');
    expect(title.textContent).toEqual('Cities');
    });


    it('should contain a table with a list of one or more cities', () => {
      let table = fixture.nativeElement
      .querySelector('table.mat-table');
      let tableRows = table
      .querySelectorAll('tr.mat-row');
      expect(tableRows.length).toBeGreaterThan(0);
});
});
