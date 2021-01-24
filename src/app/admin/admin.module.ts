import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddAdminComponent } from './add-admin/add-admin.component';
import { ManageAdminComponent } from './manage-admin/manage-admin.component';
import { UbahAdminComponent } from './ubah-admin/ubah-admin.component';
import { GlobalModule } from '../global/global.module';


const routes: Routes = [
    { path: 'add-admin', component: AddAdminComponent },
    { path: 'manage-admin', component: ManageAdminComponent },
    { path: 'ubah-admin/:key', component: UbahAdminComponent }
];

@NgModule({
    declarations: [AddAdminComponent, ManageAdminComponent, UbahAdminComponent],
    imports: [
        CommonModule,
        NgbModule,
        GlobalModule,
        RouterModule.forChild(routes),
    ]
})
export class AdminModule { }
