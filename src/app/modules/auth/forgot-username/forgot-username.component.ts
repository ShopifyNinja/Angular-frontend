import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../auth';

@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss']
})
export class ForgotUsernameComponent implements OnInit {


  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {

  }

}
