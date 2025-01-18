import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/cfeature/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'World Cities';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.init()
  }

}
