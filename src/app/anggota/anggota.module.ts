import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddAnggotaComponent } from './add-anggota/add-anggota.component';
import { ManageAnggotaComponent } from './manage-anggota/manage-anggota.component';
import { UbahAnggotaComponent } from './ubah-anggota/ubah-anggota.component';
import { GlobalModule } from '../global/global.module';

const routes: Routes = [
  { path: 'add-anggota', component: AddAnggotaComponent },
  { path: 'manage-anggota', component: ManageAnggotaComponent },
  { path: 'ubah-anggota/:key', component: UbahAnggotaComponent }
];

@NgModule({
  declarations: [AddAnggotaComponent, ManageAnggotaComponent, UbahAnggotaComponent],
  imports: [
    CommonModule,
    NgbModule,
    GlobalModule,
    RouterModule.forChild(routes),
  ]
})
export class AnggotaModule { }
