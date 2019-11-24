import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DebtsService } from '../debts.service';
import { Validators, FormBuilder } from '@angular/forms';
import { User } from '../user';
import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

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
    creditor: [null, Validators.required],
    payWay: ['Сбер', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private debts: DebtsService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.users$ = combineLatest([this.debts.getUsers(), this.route.queryParams]).pipe(
      tap(([_, { amount, creditor }]) => {
        if (amount) {
          this.payForm.controls.amount.setValue(Number.parseInt(amount, 10));
        }

        if (creditor) {
          this.payForm.controls.creditor.setValue(creditor);
        }
      }),
      map(([users]) => users)
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

    const amount = this.payForm.controls['amount'].value;
    const creditorId = this.payForm.controls['creditor'].value;
    const description = this.payForm.controls['payWay'].value;

    const isConfirmed = confirm(`Ты точно уже вернул ${creditorId} ${amount} рублей?`);

    if (!isConfirmed) {
      return;
    }

    this.isLoading = true;

    this.debts.payDebt({
      debtorId: this.auth.currentUser,
      amount,
      creditorId,
      description
    }).subscribe(() => {
      this.isLoading = false;

      this.payForm.reset({
        payWay: 'Сбер'
      });

      this.toastr.success(`🙏 Возвращено ${amount} рублей`)
    })
  }

}
