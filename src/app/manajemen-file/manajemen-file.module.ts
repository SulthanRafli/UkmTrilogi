import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddLpjComponent } from './add-lpj/add-lpj.component';
import { ManageLpjComponent } from './manage-lpj/manage-lpj.component';
import { UbahLpjComponent } from './ubah-lpj/ubah-lpj.component';
import { AddProkerComponent } from './add-proker/add-proker.component';
import { ManageProkerComponent } from './manage-proker/manage-proker.component';
import { UbahProkerComponent } from './ubah-proker/ubah-proker.component';

import { GlobalModule } from '../global/global.module';


const routes: Routes = [
    { path: 'add-lpj', component: AddLpjComponent },
    { path: 'manage-lpj', component: ManageLpjComponent },
    { path: 'ubah-lpj/:key', component: UbahLpjComponent },
    { path: 'add-proker', component: AddProkerComponent },
    { path: 'manage-proker', component: ManageProkerComponent },
    { path: 'ubah-proker/:key', component: UbahProkerComponent }
];

@NgModule({
    declarations: [AddLpjComponent, ManageLpjComponent, UbahLpjComponent, AddProkerComponent, ManageProkerComponent, UbahProkerComponent],
    imports: [
        CommonModule,
        NgbModule,
        GlobalModule,
        RouterModule.forChild(routes),
    ]
})
export class ManajemenFileModule { }
