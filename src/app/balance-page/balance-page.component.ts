import _ from "lodash";
import { Component, OnInit } from "@angular/core";
import { DebtsService } from "../debts.service";
import { Observable } from "rxjs";
import { User } from "../user";
import { AuthService } from "../auth.service";
import { map } from "rxjs/operators";

type Balance = Array<[string, number]>;

@Component({
  selector: "app-balance-page",
  templateUrl: "./balance-page.component.html",
  styleUrls: ["./balance-page.component.css"]
})
export class BalancePageComponent implements OnInit {
  isLoading = false;

  // Должники, кто должен мне
  debtors: Balance = [];
  // Заемщики, кому должен я
  creditors: Balance = [];

  constructor(private debts: DebtsService, private auth: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.debts.getUserInfo(this.auth.currentUser.id).subscribe(user => {
      console.log(user);
      this.debtors = _.toPairs(_.pickBy(user.balances, balance => balance > 0));
      this.creditors = _.toPairs(
        _.pickBy(user.balances, balance => balance < 0)
      );

      this.isLoading = false;
    });
  }

  // Сколько я всего должен
  get totalDebt() {
    console.log("FIXME: add totalDebt  cache?");
    return _.sumBy(this.creditors, ([, amount]) => -amount);
  }

  // Сколько мне всего должны
  get totalCredit() {
    console.log("FIXME: add totalCredit cache?");
    return _.sumBy(this.debtors, ([, amount]) => amount);
  }
}
