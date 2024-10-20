import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  acno: any
  user: any
  sDetails: any



  constructor(private ds: DataService, private fb: FormBuilder, private router: Router) {

    //access data from dataservice and store in a variable

    this.user = localStorage.getItem("currentUser")

    this.sDetails = new Date()

  }

  ngOnInit(): void {
    if (!localStorage.getItem("currentAcno")) {
      alert("please login")
      this.router.navigateByUrl("")
    }
  }

  depositForm = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    psw: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]+')]],
    amnt: ['', [Validators.required, Validators.pattern('[0-9]+')]]
  })
  withdrawForm = this.fb.group({
    acno1: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    psw1: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]+')]],
    amnt1: ['', [Validators.required, Validators.pattern('[0-9]+')]]
  })

  deposit() {
    var acno = this.depositForm.value.acno
    var psw = this.depositForm.value.psw
    var amnt = this.depositForm.value.amnt
    if (this.depositForm.valid) {
      this.ds.deposit(acno, psw, amnt).subscribe((result: any) => {
        alert(result.messsage)
      },
        result => {
          alert(result.error.messsage)
        }
      )

    }
    else {
      alert('Invalid form')
    }

  }

  withdrew() {
    var acno = this.withdrawForm.value.acno1
    var psw = this.withdrawForm.value.psw1
    var amnt = this.withdrawForm.value.amnt1
    if (this.withdrawForm.valid) {
      this.ds.withdrew(acno, psw, amnt).subscribe((result: any) => {
        alert(result.messsage)
      },
        result => {
          alert(result.error.messsage)
        }
      )

    }
    else {
      alert('Invalid form')
    }

  }

  logout() {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("currentAcno")
    this.router.navigateByUrl("")
  }
  deleteAcc() {
    this.acno = JSON.parse(localStorage.getItem("currentAcno") || "")
  }

  cancelChild() {
    this.acno = ""
  }

  ondeleteAcc(event: any) {
    this.ds.deleteAcc(event).subscribe((result: any) => {
      alert(result.messsage)
      // this.router.navigateByUrl("")
      this.logout()
    })
  }

}



