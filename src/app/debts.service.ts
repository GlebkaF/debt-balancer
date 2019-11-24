import _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators'
import { User } from './user';
import users from './users';
import { LogService } from './log.service';

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
    private log: LogService
  ) { }

  getUsers(): Observable<User[]> {
    return of(users);
  }

  /** GET heroes from the server */
  getUserInfo(id: string): Observable<User> {
    return this.sendRpcRequest('getUserInfo', { id })
      .pipe(
        tap(_ => console.log('getUserInfo', _)),
        map(({ result }) => result),
        catchError((error) => {
          this.log.error(error);
          return of({
            id,
            name: "Неизвестный",
            balanses: {}
          })
        })
      );
  }

  addPurchase({ buyerId, price, debtorsIds, description }): Observable<undefined> {
    return this.sendRpcRequest('addPurchase', { buyerId, price, debtorsIds, description })
      .pipe(
        tap(_ => console.log('addedPurchase', _)),
        catchError((error) => {
          this.log.error(error);
          return of()
        })
      );
  }

  payDebt({ debtorId, creditorId, amount, description }): Observable<undefined> {
    return this.sendRpcRequest('payDebt', { debtorId, creditorId, amount })
      .pipe(
        tap(_ => console.log('addedPurchase', _)),
        catchError((error) => {
          this.log.error(error);
          return of(undefined)
        })
      );
  }

  private sendRpcRequest(method, params = {}) {
    return this.http.post<any>(
      this.apiBase,
      {
        id: 1,
        jsonrpc: "2.0",
        method,
        params,
      },
      this.httpOptions
    ).pipe(
      map(res => {
        if(res.error) {
          throw new Error(_.get(res, 'error.message', res.error));
        }
    
        return res;
      })
    );
  }
}
