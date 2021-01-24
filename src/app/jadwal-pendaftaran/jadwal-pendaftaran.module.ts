import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddJadwalPendaftaranComponent } from './add-jadwal-pendaftaran/add-jadwal-pendaftaran.component';
import { ManageJadwalPendaftaranComponent } from './manage-jadwal-pendaftaran/manage-jadwal-pendaftaran.component';
import { UbahJadwalPendaftaranComponent } from './ubah-jadwal-pendaftaran/ubah-jadwal-pendaftaran.component';
import { GlobalModule } from '../global/global.module';


const routes: Routes = [
  { path: 'add-jadwal-pendaftaran', component: AddJadwalPendaftaranComponent },
  { path: 'manage-jadwal-pendaftaran', component: ManageJadwalPendaftaranComponent },
  { path: 'ubah-jadwal-pendaftaran/:key', component: UbahJadwalPendaftaranComponent }
];

@NgModule({
  declarations: [AddJadwalPendaftaranComponent, ManageJadwalPendaftaranComponent, UbahJadwalPendaftaranComponent],
  imports: [
    CommonModule,
    NgbModule,
    GlobalModule,
    RouterModule.forChild(routes),
  ]
})
export class JadwalPendaftaranModule { }
