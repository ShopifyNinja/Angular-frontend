import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/core';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../auth';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
})
export class CreatePassword implements OnInit {
  items: Object[] = [];
  form: FormGroup;
  /* form = new FormGroup({
    passwordConfirm: new FormControl('', [Validators.required]),
  }); */

  constructor(
    private layout: LayoutService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    /*  this.form.patchValue({
      name: 'John Doe',
      zipCode: '12345',
      phone: '123 867 5309',
      email: 'johndoe@example.com',
    }); */
  }
  ngOnInit(): void {
    this.layout.setCSSClass('content_container', 'p0');
    this.form = this.initValidations();
  }

  initValidations(): FormGroup {
    return this.fb.group(
      {
        password: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/(?=.*[a-z])(?=.*[A-Z])/, {
              hasUpperLower: true,
            }),
            CustomValidators.patternValidator(/[*@!#%&()^~{}\d]+/, {
              hasNumber: true,
            }),
            Validators.minLength(8),
          ]),
        ],
        passwordConfirm: [null, Validators.compose([Validators.required])],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.router.navigate(['/message-center']);
      this.authService
        .createPassword(
          this.authService.currentUserValue,
          this.form.value.password
        )
        .subscribe((u) => {
          if (u) {
            this.router.navigate(['/message-center']);
            this.toastr.success(
              'Password successfully created.',
              'Create Password'
            );
          } else {
            this.toastr.error(
              'Create password failed, please contact an administrator.',
              'Create Password'
            );
          }
        });
    } else {
      this.toastr.error('Passwords not matching or invalid.', 'Authentication');
    }
  }
}
