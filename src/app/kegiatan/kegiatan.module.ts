import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddKegiatanComponent } from './add-kegiatan/add-kegiatan.component';
import { ManageKegiatanComponent } from './manage-kegiatan/manage-kegiatan.component';
import { UbahKegiatanComponent } from './ubah-kegiatan/ubah-kegiatan.component';
import { GlobalModule } from '../global/global.module';


const routes: Routes = [
  { path: 'add-kegiatan', component: AddKegiatanComponent },
  { path: 'manage-kegiatan', component: ManageKegiatanComponent },
  { path: 'ubah-kegiatan/:key', component: UbahKegiatanComponent }
];

@NgModule({
  declarations: [AddKegiatanComponent, ManageKegiatanComponent, UbahKegiatanComponent],
  imports: [
    CommonModule,
    NgbModule,
    GlobalModule,
    RouterModule.forChild(routes),
  ]
})
export class KegiatanModule { }
