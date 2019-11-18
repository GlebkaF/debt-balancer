import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../user';
import { DebtsService } from '../debts.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-add-purchase-page',
  templateUrl: './add-purchase-page.component.html',
  styleUrls: ['./add-purchase-page.component.css']
})
export class AddPurchasePageComponent implements OnInit {
  users$: Observable<User[]>;
  isLoading: boolean = false;
  isSuccess: boolean = false;

  purchaseForm = this.fb.group({
    price: [null, Validators.compose([
      Validators.required,
      Validators.min(1)
    ])],
    description: [null, Validators.required],
    users: [[this.auth.currentUser], Validators.required]
  });

  constructor(private fb: FormBuilder, private debts: DebtsService, private auth: AuthService) { }

  ngOnInit() {
    this.users$ = this.debts.getUsers();
  }

  onSubmit() {
    if (!this.auth.currentUser) {
      alert('Сначала нужно авторизоваться')
      return;
    }

    if (!this.purchaseForm.valid) {
      return;
    }
    
    this.isLoading = true;
    this.isSuccess = false;

    this.debts.addPurchase({
      buyerId: this.auth.currentUser,
      price: this.purchaseForm.controls['price'].value,
      debtorsIds: this.purchaseForm.controls['users'].value
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.purchaseForm.reset({
          users: [this.auth.currentUser]
        });        
      },
      error: (error) => {
        console.error(error);
        alert("Не могу добавить покупку, попробуй позже");
      }
    })
  }
}
