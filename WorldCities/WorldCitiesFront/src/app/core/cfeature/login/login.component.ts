import { LoginRequest } from './../auth/login-request';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../components/base-form.component';
import { LoginResult } from '../auth/login-result';
import { AuthService } from '../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent
  extends BaseFormComponent
  implements OnInit {

    loginResult?:LoginResult

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  onSubmit(){
    var loginRequest = <LoginRequest>{}
    loginRequest.email = this.form.controls['email'].value
    loginRequest.password = this.form.controls['password'].value

    this.authService
      .login(loginRequest)
      .subscribe(
        result =>{
        console.log(result)
        this.loginResult = result
        if(result.success){
          this.router.navigate(["/"])
        }
      }, error=>{
        console.log(error)
        if (error.status == 401){
          this.loginResult = error.error
        }
      })

  }

}
