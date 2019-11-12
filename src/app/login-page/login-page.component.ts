import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  private user: string
  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  changeUser({ value }) {
    this.user = value;
  }

  login() {
    this.authService.login(this.user);
    this.router.navigate(['/add-purchase/']);
  }

}
