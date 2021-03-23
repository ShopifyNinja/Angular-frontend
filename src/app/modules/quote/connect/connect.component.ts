import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../auth';

import { ProspectUserService } from '../_services/prospect-user.component';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {
  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
  });

  constructor(
    private prospectUserService: ProspectUserService,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.prospectUserService.requestQuote(this.form.value.fullName, +this.form.value.zipCode, this.form.value.phone, this.form.value.email)
        .subscribe(u => {
          this.router.navigate(['/quote/check-email', u]);
        });
    }else{
      console.log(this.form);
    }
  }

}
