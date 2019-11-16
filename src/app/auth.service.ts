import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public users: Array<string> = [
    'glebkaf',
    'Devkabezruki',
    'igor_naz',
    'glebmozhetvzhopu',
    'serega_phenomen',
    'marinerius',
    'anikin_antosha',
    'grossbox'
  ]

  public currentUser: string = ''

  constructor(private router: Router) {
    const login = localStorage.getItem('login');

    if(this.users.includes(login)) {
      this.currentUser = login;
    }
  }

  login(login: string) {
    if(!this.users.includes(login)) {
      throw new Error('Такого юзера несуществует');
    }

    this.currentUser = login;

    localStorage.setItem('login', login);
  }

  logout() {
    this.currentUser = '';
    localStorage.setItem('login', '');
    this.router.navigate(['/login/']);
  }
}
