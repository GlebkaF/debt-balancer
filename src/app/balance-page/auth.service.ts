import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DebtsService } from "./debts.service";
import { CompactUser, User } from "./user";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  /** ID залогиненого юзера */
  public currentUser$: Observable<User>;
  public currentUser: CompactUser;

  constructor(private router: Router, private debts: DebtsService) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      this.login(user);
    } catch (e) {
      localStorage.setItem("user", undefined);
    }
  }

  login(user: CompactUser) {
    this.currentUser$ = this.debts.getUserInfo(user.id).pipe(shareReplay());
    this.currentUser = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    this.currentUser = undefined;
    localStorage.setItem("user", undefined);
    this.router.navigate(["/login/"]);
  }
}
