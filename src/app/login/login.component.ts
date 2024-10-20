import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  data1 = "Enter your account number";
  data2 = "Enter your password";

  constructor(private router: Router, private ds: DataService, private fb: FormBuilder) { }

  loginForm = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9]+')]], 
    psw: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]+')]] 
  });

  login() {
    var acno = this.loginForm.value.acno; 
    var psw = this.loginForm.value.psw; 

    if (this.loginForm.valid) {
      this.ds.login(acno, psw).subscribe(
        (result: any) => {
         
          localStorage.setItem("currentUser", result.currentUser); 
          localStorage.setItem("currentAcno", JSON.stringify(result.currentAcno)); 
          localStorage.setItem("token", JSON.stringify(result.token));

          alert(result.message); 
          this.router.navigateByUrl("dashboard"); 
        },
        (error: any) => {
          
          alert(error.error.message || 'Login failed. Please try again.'); 
        }
      );
    } else {
      alert('Invalid form'); 
    }
  }
}
