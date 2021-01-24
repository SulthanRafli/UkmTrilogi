import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { Ukm } from 'src/app/models/ukm.model';
import { UkmService } from 'src/app/services/firebase/ukm.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-manage-ukm',
  templateUrl: './manage-ukm.component.html',
  styleUrls: ['./manage-ukm.component.scss']
})

export class ManageUkmComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public displayedColumns = ['no', 'logo', 'nama', 'email', 'telp', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public ukm: Ukm[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public ukmService: UkmService,
  ) { }

  ngOnInit(): void {
    this.getAllUkm();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllUkm(): void {
    this.loading = true;
    this.ukmService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.ukm = data.map(e => {
          return {
            id: e.payload.doc.id,
            nama: e.payload.doc.data()['nama'],
            email: e.payload.doc.data()['email'],
            password: e.payload.doc.data()['password'],
            telp: e.payload.doc.data()['telp'],
            deskripsi: e.payload.doc.data()['deskripsi'],
            alamat: e.payload.doc.data()['alamat'],
            fileLogoName: e.payload.doc.data()['fileLogoName'],
            imageLogoUrl: e.payload.doc.data()['imageLogoUrl'],
            fileStrukturName: e.payload.doc.data()['fileStrukturName'],
            imageStrukturUrl: e.payload.doc.data()['imageStrukturUrl'],
          }
        });
        this.dataSource = new MatTableDataSource(this.ukm);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.ukm.length;
        this.changeDetectorRef.detectChanges();
        this.loading = false;
      },
      (error) => { },
    );
  }

  delete(ukm) {
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
        return this.ukmService.delete(ukm.id)
          .then(() => {
            this.authService.delete(ukm.email, ukm.password).catch(err => {
              Swal.showValidationMessage(
                `Request failed: ${err}`
              )
            });
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