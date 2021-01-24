import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ListPengumumanComponent } from './list-pengumuman/list-pengumuman.component';
import { DetailPengumumanComponent } from './detail-pengumuman/detail-pengumuman.component';
import { GlobalModule } from '../global/global.module';

const routes: Routes = [
    { path: 'list-pengumuman', component: ListPengumumanComponent },
    { path: 'detail-pengumuman/:key', component: DetailPengumumanComponent },
];

@NgModule({
    declarations: [ListPengumumanComponent, DetailPengumumanComponent],
    imports: [
        CommonModule,
        NgbModule,
        GlobalModule,
        RouterModule.forChild(routes),
    ]
})
export class PengumumanModule { }
