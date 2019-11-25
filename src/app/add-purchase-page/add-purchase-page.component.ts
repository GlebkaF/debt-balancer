import _ from "lodash";

import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { CompactUser } from "../user";
import { DebtsService } from "../debts.service";
import { AuthService } from "../auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-add-purchase-page",
  templateUrl: "./add-purchase-page.component.html",
  styleUrls: ["./add-purchase-page.component.css"]
})
export class AddPurchasePageComponent implements OnInit {
  users$: Observable<CompactUser[]>;
  isLoading = false;

  purchaseForm = this.fb.group({
    price: [null, Validators.compose([Validators.required, Validators.min(1)])],
    description: [null, Validators.required],
    users: [[this.auth.currentUser.id], Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private debts: DebtsService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.users$ = this.debts.users$;
  }

  onSubmit() {
    if (!this.auth.currentUser) {
      alert("Сначала нужно авторизоваться");
      return;
    }

    if (!this.purchaseForm.valid) {
      return;
    }

    const description = this.purchaseForm.controls.description.value;
    const users = this.purchaseForm.controls.users.value;

    if (_.isEqual(users, [this.auth.currentUser.id])) {
      this.toastr.warning(
        "Выбери еще кого-нибудь чтобы покупка стала общей",
        " 👨‍👩‍👦‍👦  Ты выбрал только себя"
      );
      return;
    }

    this.isLoading = true;
    this.debts
      .addPurchase({
        buyerId: this.auth.currentUser.id,
        price: this.purchaseForm.controls.price.value,
        debtorsIds: users,
        description
      })
      .subscribe(() => {
        this.isLoading = false;

        this.purchaseForm.reset({
          users: [this.auth.currentUser.id]
        });

        this.toastr.success(`👌 Покупка "${description}" добавлена`);
      });
  }
}
