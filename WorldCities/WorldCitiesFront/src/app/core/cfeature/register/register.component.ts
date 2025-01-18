import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../components/base-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterRequest } from '../auth/register-request';
import { LoginResult } from '../auth/login-result';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends BaseFormComponent implements OnInit {

  loginResult?:LoginResult

  constructor(private router: Router, private authService: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, ]),
    });
  }

  onSubmit(){
      var registerRequest = <RegisterRequest>{}
      registerRequest.username = this.form.controls['username'].value
      registerRequest.email = this.form.controls['email'].value
      registerRequest.password = this.form.controls['password'].value

      this.authService
        .register(registerRequest)
        .subscribe(
          result =>{
          console.log(result)
          this.loginResult = result
          if(result.success){
            this.router.navigate(["/"])
          }
        }, error=>{
          console.log(error)
          if (error.status == 409){
            this.loginResult = error.error
          }

        })

    }
}
