import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddJadwalPertemuanComponent } from './add-jadwal-pertemuan/add-jadwal-pertemuan.component';
import { ManageJadwalPertemuanComponent } from './manage-jadwal-pertemuan/manage-jadwal-pertemuan.component';
import { UbahJadwalPertemuanComponent } from './ubah-jadwal-pertemuan/ubah-jadwal-pertemuan.component';
import { GlobalModule } from '../global/global.module';


const routes: Routes = [
  { path: 'add-jadwal-pertemuan', component: AddJadwalPertemuanComponent },
  { path: 'manage-jadwal-pertemuan', component: ManageJadwalPertemuanComponent },
  { path: 'ubah-jadwal-pertemuan/:key', component: UbahJadwalPertemuanComponent }
];

@NgModule({
  declarations: [AddJadwalPertemuanComponent, ManageJadwalPertemuanComponent, UbahJadwalPertemuanComponent],
  imports: [
    CommonModule,
    NgbModule,
    GlobalModule,
    RouterModule.forChild(routes),
  ]
})
export class JadwalPertemuanModule { }
