import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { ContentAnimateDirective } from './shared/directives/content-animate.directive';
import { SaveLockButtonDirective } from './shared/directives/save-lock-button.directive';

import { GlobalModule } from './global/global.module';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth/auth.service';
import { AdministratorGuard } from './services/guard/administrator.guard';
import { AdminUkmGuard } from './services/guard/admin-ukm.guard';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TodoComponent } from './apps/todo-list/todo/todo.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { TodoListComponent } from './apps/todo-list/todo-list.component';
import { NavbarUserComponent } from './shared/navbar-user/navbar-user.component';
import { HomeComponent } from './home/home.component';
import { ProfileUkmComponent } from './profile-ukm/profile-ukm.component';
import { InformasiComponent } from './informasi/informasi.component';
import { ListPendaftaranComponent } from './list-pendaftaran/list-pendaftaran.component';
import { FormPendaftaranComponent } from './form-pendaftaran/form-pendaftaran.component';
import { BacaBeritaComponent } from './baca-berita/baca-berita.component';

import { AngularFireModule } from '@angular/fire'
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './layouts/guest-layout/guest-layout.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    TodoListComponent,
    TodoComponent,
    SpinnerComponent,
    ContentAnimateDirective,
    SaveLockButtonDirective,
    NavbarUserComponent,
    HomeComponent,
    ProfileUkmComponent,
    InformasiComponent,
    AdminLayoutComponent,
    GuestLayoutComponent,
    ListPendaftaranComponent,
    FormPendaftaranComponent,
    BacaBeritaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ChartsModule,
    GlobalModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [AuthService, ThemeService, AdministratorGuard, AdminUkmGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
