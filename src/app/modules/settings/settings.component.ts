import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class SettingsComponent implements OnInit {
  showListActive: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  toggleSublist(event) {
    var el = event.target;
    el.classList.toggle('active');
    this.showListActive = !this.showListActive;
  }

  goToPage(navLink: string): void {
    this.router.navigate(['/message-center/create-password']);
  }

  logout() {
    this.authService.logout();
    this.activeModal.dismiss('Cross click');
  }
}
