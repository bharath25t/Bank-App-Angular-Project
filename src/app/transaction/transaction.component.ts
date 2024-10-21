import { Component } from '@angular/core';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {

  transactionArray: any;  // To store the transaction data

  constructor(private ds: DataService) {
    this.getTransactionData();
  }

  // Method to get transaction data from the server
  getTransactionData() {
    const currentAcno = JSON.parse(localStorage.getItem("currentAcno") || "");  // Get current account number from local storage

    if (currentAcno) {
      this.ds.getTransaction(currentAcno).subscribe(
        (result: any) => {
          // Handle success
          this.transactionArray = result.transactions;  // Store transaction array from the result
          console.log(this.transactionArray);
        },
        (error) => {
          // Handle error
          alert(error.error.message);  // Show error message if there's an issue
        }
      );
    } else {
      alert("No account number found in local storage");  // Error handling if account number is missing
    }
  }
}
