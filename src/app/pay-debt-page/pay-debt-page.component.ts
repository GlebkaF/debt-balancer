import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DebtsService } from '../debts.service';
import { Validators, FormBuilder } from '@angular/forms';
import { User } from '../user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pay-debt-page',
  templateUrl: './pay-debt-page.component.html',
  styleUrls: ['./pay-debt-page.component.css']
})
export class PayDebtPageComponent implements OnInit {
  users$: Observable<User[]>;
  isLoading: boolean = false;
  isSuccess: boolean = false;

  payForm = this.fb.group({
    amount: [null, Validators.compose([
      Validators.required,
      Validators.min(1)
    ])],
    creditor: [null, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private debts: DebtsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.users$ = this.debts.getUsers().pipe(
      map(users => users.filter(user => user.id !== this.auth.currentUser))
    );
  }

  onSubmit() {
    if (!this.auth.currentUser) {
      alert('Сначала нужно авторизоваться')
      return;
    }

    if (!this.payForm.valid) {
      return;
    }

    this.isLoading = true;

    const amount = this.payForm.controls['amount'].value;
    const creditorId = this.payForm.controls['creditor'].value;

    this.debts.payDebt({
      debtorId: this.auth.currentUser,
      amount,
      creditorId,
    }).subscribe(() => {
      this.isLoading = false;
      this.payForm.reset();

      this.toastr.success(`🙏 Возвращено ${amount} рублей`)
    })
  }

}
