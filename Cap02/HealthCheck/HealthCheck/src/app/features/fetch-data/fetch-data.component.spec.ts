import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchDataComponent } from './fetch-data.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FetchDataComponent', () => {
  let component: FetchDataComponent;
  let fixture: ComponentFixture<FetchDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ FetchDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should render title', () => {
    const fixture = TestBed.createComponent(FetchDataComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Weather forecast');
    //expect(compiled.querySelector('.content span')?.textContent).toContain('HealthCheck app is running!');
  });
});
