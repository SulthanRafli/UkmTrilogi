import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, CanActivate } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProfileUkmComponent } from './profile-ukm/profile-ukm.component';
import { InformasiComponent } from './informasi/informasi.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './layouts/guest-layout/guest-layout.component';
import { Error404Component } from './error404/error404.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AdministratorGuard } from './services/guard/administrator.guard';
import { AdminUkmGuard } from './services/guard/admin-ukm.guard';
import { FormPendaftaranComponent } from './form-pendaftaran/form-pendaftaran.component';
import { ListPendaftaranComponent } from './list-pendaftaran/list-pendaftaran.component';
import { BacaBeritaComponent } from './baca-berita/baca-berita.component';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo(['home']);

const routes: Routes = [
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'baca-berita/:key',
        component: BacaBeritaComponent
      },
      {
        path: 'profile-ukm',
        component: ProfileUkmComponent
      },
      {
        path: 'informasi',
        component: InformasiComponent
      },
      {
        path: 'pengumuman', loadChildren: () => import('./pengumuman/pengumuman.module').then(m => m.PengumumanModule)
      },
      {
        path: 'form-pendaftaran/:key',
        component: FormPendaftaranComponent
      },
      {
        path: 'list-pendaftaran',
        component: ListPendaftaranComponent
      },
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },      
      {
        path: 'anggota',
        canActivate: [AdminUkmGuard],
        loadChildren: () => import('./anggota/anggota.module').then(m => m.AnggotaModule)
      },
      {
        path: 'kegiatan',
        canActivate: [AdminUkmGuard],
        loadChildren: () => import('./kegiatan/kegiatan.module').then(m => m.KegiatanModule)
      },
      {
        path: 'jadwal-pendaftaran',
        canActivate: [AdminUkmGuard],
        loadChildren: () => import('./jadwal-pendaftaran/jadwal-pendaftaran.module').then(m => m.JadwalPendaftaranModule)
      },
      {
        path: 'berita',
        canActivate: [AdminUkmGuard],
        loadChildren: () => import('./berita/berita.module').then(m => m.BeritaModule)
      },
      {
        path: 'pendaftaran',
        canActivate: [AdminUkmGuard],
        loadChildren: () => import('./pendaftaran/pendaftaran.module').then(m => m.PendaftaranModule)
      },
      {
        path: 'manajemen-file',
        canActivate: [AdminUkmGuard],
        loadChildren: () => import('./manajemen-file/manajemen-file.module').then(m => m.ManajemenFileModule)
      },
      {
        path: 'admin',
        canActivate: [AdministratorGuard],
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'ukm',
        canActivate: [AdministratorGuard],
        loadChildren: () => import('./ukm/ukm.module').then(m => m.UkmModule)
      },
    ]
  },
  { path: '**', redirectTo: '/404' },
  { path: '404', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
