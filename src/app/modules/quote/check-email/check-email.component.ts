import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../../auth';

@Component({
  selector: 'app-check-email',
  templateUrl: './check-email.component.html',
  styleUrls: ['./check-email.component.scss']
})
export class CheckEmailComponent implements OnInit {
  @Input() type: string;
  public title: string;
  public message: string;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => this.setPageState(params['type']));
  }

  setPageState(type: string): void {
    this.title = 'Thank you!';
    this.message = "Please check your email account for a confirmation email. Once verified we can provide you with a quote and connect you with an agent. Your confirmation will expire in 24 hours.";

    if(type === 'QuotePreviouslyRequested') {
      this.title = 'Welcome back, an agent should be reaching out shortly';
    }else if(type === 'UnconfirmedEmail') {
      this.title = 'Welcome back, please confirm your email';
    }else if(type === 'AccountExists') {
      this.title = 'It looks like you already have an account';
    }else if(type === 'Email Id already exists. Type yet to be determined') {
      this.title = type;
    }
  }

}
