import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(private toastr: ToastrService) { }

  error(...args: any[]) {
    console.error.apply(null, args);
    this.toastr.error("Ошибка", args[0].message, {
      disableTimeOut: true
    })
  }
}
