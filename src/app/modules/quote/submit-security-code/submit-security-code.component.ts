import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LayoutService } from 'src/app/_metronic/core';

import { ProspectUserService } from '../_services/prospect-user.component';

@Component({
  selector: 'app-submit-security-code',
  templateUrl: './submit-security-code.component.html',
  styleUrls: ['./submit-security-code.component.scss']
})

export class SubmitSecurityCode implements OnInit {
  // URL params
  userId: string;
  via: string;

  form: FormGroup = new FormGroup({
    securityCode: new FormControl('', [Validators.required]),
  });

  constructor(
    private layout: LayoutService,
    private route: ActivatedRoute,
    private prospectUserService: ProspectUserService,
  ) { }

  ngOnInit(): void {
    this.layout.setCSSClass('content_container', 'p0');
    this.route.queryParamMap.subscribe(queryParams => {
      this.userId = queryParams.get("id");
      this.via = queryParams.get("via");
      this.generateSecurityCode();
    });
  }

  generateSecurityCode(): void {
    console.log('Generating security code');
    this.prospectUserService.generateSecurityCode(this.userId, this.via).subscribe((result) => {
      console.log('Generated');
    });
  }

  onSubmit(): void {
    this.prospectUserService.verifySecurityCode(this.userId, this.form.value.securityCode).subscribe((result) => {
      console.log('Code submitted');
    });;
  }
}
