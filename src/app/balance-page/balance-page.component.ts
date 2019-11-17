import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../debts.service';
import { Observable } from 'rxjs';
import { User } from '../user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-balance-page',
  templateUrl: './balance-page.component.html',
  styleUrls: ['./balance-page.component.css']
})
export class BalancePageComponent implements OnInit {
  isLoading: boolean = false;
  user: User;

  constructor(
    private debts: DebtsService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.debts.getUserInfo(this.auth.currentUser).subscribe(user => {
      this.user = user;
      this.isLoading = false;
    });
  }

}
