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
export class AddPurchasePageComponent implements OnInit{
  users$: Observable<User[]>;

  purchaseForm = this.fb.group({
    price: [null, Validators.compose([
      Validators.required,
      Validators.min(1)
    ])],
    description: [null, Validators.required],
    users: [[this.auth.currentUser], Validators.required]
  });

  hasUnitNumber = false;

  constructor(private fb: FormBuilder, private debts: DebtsService, private auth: AuthService) {}

  ngOnInit() {    
    this.users$ = this.debts.getUsers();
  }

  onSubmit() {
    if(!this.purchaseForm.valid) {
      return;
    }

    alert('Thanks!')
  }
}
