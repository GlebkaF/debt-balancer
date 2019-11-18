import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators'
import { User } from './user';
import users from './users';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {
  private apiBase: string = 'https://debt-balancer-sigma-five.now.sh/api';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getUsers(): Observable<User[]> {
    return of(users);
  }

  /** GET heroes from the server */
  getUserInfo(id: string): Observable<User> {
    return this.sendRpcRequest('getUserInfo', { id })
      .pipe(
        tap( _ => console.log('getUserInfo', _)),
        map(({ result }) => result)
      );
  }

  addPurchase({ buyerId, price, debtorsIds }): Observable<undefined> {
    return this.sendRpcRequest('addPurchase', { buyerId, price, debtorsIds })
      .pipe(
        tap( _ => console.log('addedPurchase', _)),
        map(() => undefined)
      );
  }

  sendRpcRequest(method, params = {}) {
    return this.http.post<any>(
      this.apiBase,
      {
        id: 1,
        jsonrpc: "2.0",
        method,
        params,
      },
      this.httpOptions
    )
  }
}
