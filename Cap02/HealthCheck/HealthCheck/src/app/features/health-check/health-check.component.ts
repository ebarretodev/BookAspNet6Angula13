import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {
  public result?: Result;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Result>(`${environment.apiUrl}/health`).subscribe({
      next:  (response)=>{
        this.result = response
      },
      error: (error)=>{console.error(error)}
    })
  }

}

interface Result {
  checks: Check[];
  totalStatus: string;
  totalResponseTime: number;
}
interface Check {
  name: string;
  responseTime: number;
  status: string;
  description: string;
}
