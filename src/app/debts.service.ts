import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators'
import { User } from './user';

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

  /** GET heroes from the server */
  getUserInfo(id: string): Observable<User> {
    return this.sendRpcRequest('getUserInfo', { id })
      .pipe(
        tap( _ => console.log('fetched heroes', _)),
        map(({ result }) => result)
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