import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddUkmComponent } from './add-ukm/add-ukm.component';
import { ManageUkmComponent } from './manage-ukm/manage-ukm.component';
import { UbahUkmComponent } from './ubah-ukm/ubah-ukm.component';
import { DetailUkmComponent } from './detail-ukm/detail-ukm.component';
import { GlobalModule } from '../global/global.module';

const routes: Routes = [
    { path: 'add-ukm', component: AddUkmComponent },
    { path: 'manage-ukm', component: ManageUkmComponent },
    { path: 'ubah-ukm/:key', component: UbahUkmComponent },
    { path: 'detail-ukm/:key', component: DetailUkmComponent }
];

@NgModule({
    declarations: [AddUkmComponent, ManageUkmComponent, UbahUkmComponent, DetailUkmComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgbModule,
        GlobalModule,
        RouterModule.forChild(routes),
    ]
})
export class UkmModule { }
