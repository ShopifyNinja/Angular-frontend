import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LayoutService } from '../../../../_metronic/core';

import { AuthService } from 'src/app/modules/auth';
import { MessagesAppService } from 'src/app/modules/shared/services/messages-app.service';
import { SettingsComponent } from 'src/app/modules/settings/settings.component';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
})
export class HeaderMobileComponent implements OnInit, AfterViewInit {
  headerLogo = '';
  asideSelfDisplay = true;
  headerMenuSelfDisplay = true;
  headerMobileClasses = '';
  headerMobileAttributes = {};
  notificationCount = 0;

  constructor(
    private layout: LayoutService,
    public authService: AuthService,
    public messagesAppService: MessagesAppService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // build view by layout config settings
    this.headerMobileClasses = this.layout.getStringCSSClasses('header_mobile');
    this.headerMobileAttributes = this.layout.getHTMLAttributes(
      'header_mobile'
    );

    this.headerLogo = this.getLogoUrl();
    this.asideSelfDisplay = this.layout.getProp('aside.self.display');
    this.headerMenuSelfDisplay = this.layout.getProp(
      'header.menu.self.display'
    );
    
    if(this.authService.currentUserSubject.getValue() !== undefined) {
      this.messagesAppService.getNotificationCount().subscribe((n) => {
        this.notificationCount = n;
        this.ref.detectChanges();
      });
    }
  }

  ngAfterViewInit() {
    // Init Header Topbar For Mobile Mode
    // KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
  }

  private getLogoUrl() {
    return `./assets/media/svg/logos/ushealth-group.svg`;
  }

  openSettingsModal() {
    const modalRef = this.modalService.open(SettingsComponent, { windowClass: 'fullscreen-modal' });
  }
}
