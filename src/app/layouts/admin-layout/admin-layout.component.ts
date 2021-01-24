import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isLoading: boolean;

  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    document.querySelector('.main-panel').classList.remove('w-100');
    document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
    document.querySelector('.content-wrapper').classList.remove('auth', 'auth-img-bg');
    document.querySelector('.content-wrapper').classList.remove('p-0');
  }
}
