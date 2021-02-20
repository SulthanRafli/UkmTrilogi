import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { Admin } from 'src/app/models/admin.model';
import { AdminService } from 'src/app/services/firebase/admin.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.scss']
})

export class ManageAdminComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public displayedColumns = ['no', 'foto', 'nama', 'email', 'password', 'telp', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public admin: Admin[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public adminService: AdminService,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getAllAdmin();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllAdmin(): void {
    this.loading = true;
    this.adminService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.admin = data.map(e => {
          return {
            id: e.payload.doc.id,
            nama: e.payload.doc.data()['nama'],
            email: e.payload.doc.data()['email'],
            password: e.payload.doc.data()['password'],
            telp: e.payload.doc.data()['telp'],
            fileName: e.payload.doc.data()['fileName'],
            imageUrl: e.payload.doc.data()['imageUrl'],
          }
        });
        this.dataSource = new MatTableDataSource(this.admin);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.admin.length;
        this.changeDetectorRef.detectChanges();
        this.loading = false;
      },
      (error) => { },
    );
  }

  delete(admin) {
    Swal.fire({
      title: "Anda sudah yakin melakukan penghapusan data ?",
      text: "Data yang sudah dihapus tidak dapat dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Iya',
      cancelButtonText: 'Tidak',
      confirmButtonColor: '#07cdae',
      cancelButtonColor: '#fe7096',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.adminService.delete(admin.id)
          .then(() => {
            this.authService.delete(admin.email, admin.password);
          })
          .catch(error => {
            Swal.showValidationMessage(
              `Request failed: ${error}`
            )
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          text: 'Data Berhasil Dihapus',
          confirmButtonColor: '#07cdae',
        }).then((result) => {
          if (result.value) {
            location.reload();
          }
        });
      }
    })
  }
}