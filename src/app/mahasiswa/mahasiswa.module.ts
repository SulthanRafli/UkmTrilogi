import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddMahasiswaComponent } from './add-mahasiswa/add-mahasiswa.component';
import { ManageMahasiswaComponent } from './manage-mahasiswa/manage-mahasiswa.component';
import { UbahMahasiswaComponent } from './ubah-mahasiswa/ubah-mahasiswa.component';
import { GlobalModule } from '../global/global.module';

const routes: Routes = [
  { path: 'add-mahasiswa', component: AddMahasiswaComponent },
  { path: 'manage-mahasiswa', component: ManageMahasiswaComponent },
  { path: 'ubah-mahasiswa/:key', component: UbahMahasiswaComponent }
];

@NgModule({
  declarations: [AddMahasiswaComponent, ManageMahasiswaComponent, UbahMahasiswaComponent],
  imports: [
    CommonModule,
    NgbModule,
    GlobalModule,
    RouterModule.forChild(routes),
  ]
})
export class MahasiswaModule { }
