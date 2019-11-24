import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(private toastr: ToastrService) { }

  error(...args: any[]) {
    console.error.apply(null, args);
    this.toastr.error(args[0].message, "Ошибка", {
      disableTimeOut: true
    })
  }
}
