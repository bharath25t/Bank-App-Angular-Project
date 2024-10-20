import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

//create global header for header overloading 
const option = {
  headers: new HttpHeaders()
}

@Injectable({
  providedIn: 'root'
})


export class DataService {

  currentUser: any
  currentAcno: any
  userDetails: any

  // userDetails: any = {
  //   1000: { username: "anu", acno: 1000, password: "abc123", balance: 0, transaction: [] },
  //   1001: { username: "arun", acno: 1001, password: "abc123", balance: 0, transaction: [] },
  //   1002: { username: "amal", acno: 1002, password: "abc123", balance: 0, transaction: [] },
  //   1003: { username: "mega", acno: 1003, password: "abc123", balance: 0, transaction: [] },
  // }

  constructor(private http: HttpClient) {
    // this.getDetails()
  }


  // saveDetails() {
  //   if (this.userDetails) {
  //     localStorage.setItem("userDetails", JSON.stringify(this.userDetails))
  //   }
  //   if (this.currentUser) {
  //     localStorage.setItem("currentUser", this.currentUser)
  //   }
  //   if (this.currentAcno) {
  //     localStorage.setItem("currentAcno", JSON.stringify(this.currentAcno))
  //   }
  // }

  // getDetails() {
  //   if (localStorage.getItem("userDetails")) {
  //     this.userDetails = JSON.parse(localStorage.getItem("userDetails") || "")
  //   }
  //   if (localStorage.getItem("currentUser")) {
  //     this.currentUser = localStorage.getItem("currentUser")
  //   }
  //   if (localStorage.getItem("currentAcno")) {
  //     this.currentAcno = JSON.parse(localStorage.getItem("currentAcno") || "")
  //   }
  // }


  getToken() {
    //access token
    const token = JSON.parse(localStorage.getItem("token") || "")
    //generate header
    let headers = new HttpHeaders()
    //check token accessed or not 
    if (token) {
      //add the token into headers
      option.headers = headers.append('access_token', token)
    }
    return option
  }



  register(acno: any, uname: any, psw: any) {
    const data = { acno, uname, psw }
    return this.http.post('http://localhost:3000/register', data)
  }

  login(acno: any, psw: any) {
    const data = { acno, psw }
    return this.http.post('http://localhost:3000/login', data)
  }


  deposit(acno: any, psw: any, amnt: any) {
    const data = { acno, psw, amnt }
    return this.http.post('http://localhost:3000/deposit', data, this.getToken())

  }




  withdrew(acno: any, psw: any, amnt: any) {
    const data = { acno, psw, amnt }
    return this.http.post('http://localhost:3000/withdrew', data, this.getToken())
  }

  getTransaction(acno: any) {
    const data = { acno }
    return this.http.post('http://localhost:3000/getTransaction', data, this.getToken())
  }

  deleteAcc(acno: any) {
    return this.http.delete('http://localhost:3000/deleteacc' + acno, this.getToken())
  }


}

