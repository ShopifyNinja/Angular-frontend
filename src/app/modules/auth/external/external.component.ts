import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../auth';
import { UserModel } from '../_models/user.model';

@Component({
  selector: 'app-external-auth',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class ExternalAuthComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    let fragment = this.route.snapshot.fragment;
    if(fragment && fragment.includes('=')){
      let token = this.route.snapshot.fragment.split('=')[1];

      let userData = jwt_decode(token);

      let userModel = <UserModel> {
        id: userData['sub'],
        token: token,
        fullName: userData['given_name'],
        type: userData['extension_UserType'],
      };

      this.authService.setAuthFromLocalStorage(userModel);
      this.authService.currentUserValue = userModel;

      this.router.navigate(['/message-center']);
    }else{
      this.toastr.error('Token Undefined', 'Please try logging in again.');
    }
  }
}
