import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SeleksiPendaftaranComponent } from './seleksi-pendaftaran/seleksi-pendaftaran.component';
import { LaporanPendaftaranComponent } from './laporan-pendaftaran/laporan-pendaftaran.component';
import { GlobalModule } from '../global/global.module';
import { DetailPendaftaranComponent } from './detail-pendaftaran/detail-pendaftaran.component';

const routes: Routes = [
    { path: 'seleksi-pendaftaran', component: SeleksiPendaftaranComponent },
    { path: 'laporan-pendaftaran', component: LaporanPendaftaranComponent },
    { path: 'detail-pendaftaran/:key', component: DetailPendaftaranComponent },
];

@NgModule({
    declarations: [SeleksiPendaftaranComponent, LaporanPendaftaranComponent, DetailPendaftaranComponent],
    imports: [
        CommonModule,
        NgbModule,
        GlobalModule,
        RouterModule.forChild(routes),
    ]
})
export class PendaftaranModule { }
