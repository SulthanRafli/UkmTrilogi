import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/models/admin.model';
import { Ukm } from 'src/app/models/ukm.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  public iconOnlyToggled = false;
  public sidebarToggled = false;
  public admin: Admin;
  public ukm: Ukm;
  public image: string;
  public nama: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    config: NgbDropdownConfig
  ) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    if(localStorage.getItem('role') == 'Administrator'){
      this.admin = JSON.parse(localStorage.getItem('admin'));
      this.image = this.admin.imageUrl;
      this.nama = this.admin.nama;
    }else{
      this.ukm = JSON.parse(localStorage.getItem('ukm'));
      this.image = this.ukm.imageLogoUrl;
      this.nama = this.ukm.nama;
    }
  }

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  toggleSidebar() {
    let body = document.querySelector('body');
    if ((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if (this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if (this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  signOut() {
    document.querySelector('.main-panel').classList.add('w-100');
    this.authService.signOut();
    this.router.navigate(['/home']);
  }
}
