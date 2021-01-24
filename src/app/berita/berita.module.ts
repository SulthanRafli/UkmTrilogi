import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddBeritaComponent } from './add-berita/add-berita.component';
import { ManageBeritaComponent } from './manage-berita/manage-berita.component';
import { UbahBeritaComponent } from './ubah-berita/ubah-berita.component';
import { GlobalModule } from '../global/global.module';

const routes: Routes = [
  { path: 'add-berita', component: AddBeritaComponent },
  { path: 'manage-berita', component: ManageBeritaComponent },
  { path: 'ubah-berita/:key', component: UbahBeritaComponent }
];

@NgModule({
  declarations: [AddBeritaComponent, ManageBeritaComponent, UbahBeritaComponent],
  imports: [
    CommonModule,
    NgbModule,
    GlobalModule,
    RouterModule.forChild(routes),
  ]
})
export class BeritaModule { }
