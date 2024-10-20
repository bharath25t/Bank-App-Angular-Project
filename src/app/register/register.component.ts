import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  d1 = "Enter account number";
  d2 = "Enter password";

  constructor(private ds: DataService, private router: Router, private fb: FormBuilder) { }

  // Form model for register form 
  registerForm1 = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9]+')]],  
    psw: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],  
    uname: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]]  
  });

  
  register() {
    const acno = this.registerForm1.value.acno ?? ''; 
    const uname = this.registerForm1.value.uname ?? '';
    const psw = this.registerForm1.value.psw ?? '';


    if (this.registerForm1.valid && acno && uname && psw) {
      this.ds.register(acno, uname, psw).subscribe(
        (result: any) => {
          alert(result.message);  
          this.router.navigateByUrl("/login"); 
        },
        (error) => {
          alert(error.error.message); 
        }
      );
    } else {
      alert("Invalid form data");
    }
  }
}
