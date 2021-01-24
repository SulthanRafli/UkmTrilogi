import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/models/admin.model';
import { Ukm } from 'src/app/models/ukm.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public uiBasicCollapsed = false;
  public samplePagesCollapsed = false;
  public admin: Admin;
  public ukm: Ukm;
  public role: string;
  public image: string;
  public nama: string;

  constructor() { }

  ngOnInit() {
    const body = document.querySelector('body');
    
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
    
    this.role = localStorage.getItem('role');
    if(this.role == 'Administrator'){
      this.admin = JSON.parse(localStorage.getItem('admin'));
      this.image = this.admin.imageUrl;
      this.nama = this.admin.nama;
    }else{
      this.ukm = JSON.parse(localStorage.getItem('ukm'));
      this.image = this.ukm.imageLogoUrl;
      this.nama = this.ukm.nama;
    }
  }

}
