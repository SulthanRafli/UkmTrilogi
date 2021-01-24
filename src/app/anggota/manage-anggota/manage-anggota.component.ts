import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Anggota } from 'src/app/models/anggota.model';
import { AnggotaService } from 'src/app/services/firebase/anggota.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-anggota',
  templateUrl: './manage-anggota.component.html',
  styleUrls: ['./manage-anggota.component.scss']
})

export class ManageAnggotaComponent implements OnInit {

  public displayedColumns = ['no', 'foto', 'nama', 'jenisKelamin', 'jurusan', 'fakultas', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public anggota: Anggota[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public anggotaService: AnggotaService,
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getAllAnggota();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllAnggota(): void {
    this.loading = true;
    this.anggotaService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.anggota = data.map(e => {
          return {
            id: e.payload.doc.id,
            idUkm: e.payload.doc.data()['idUkm'],
            namaUkm: e.payload.doc.data()['namaUkm'],
            nama: e.payload.doc.data()['nama'],
            tempatLahir: e.payload.doc.data()['tempatLahir'],
            tanggalLahir: e.payload.doc.data()['tanggalLahir'],
            jurusan: e.payload.doc.data()['jurusan'],
            fakultas: e.payload.doc.data()['fakultas'],
            alamat: e.payload.doc.data()['alamat'],
            jenisKelamin: e.payload.doc.data()['jenisKelamin'],
            email: e.payload.doc.data()['email'],
            telp: e.payload.doc.data()['telp'],
            fileName: e.payload.doc.data()['fileName'],
            imageUrl: e.payload.doc.data()['imageUrl'],
          }
        });
        this.dataSource = new MatTableDataSource(this.anggota);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.anggota.length;
        this.changeDetectorRef.detectChanges();
        this.loading = false;
      },
      (error) => {
        console.log(error);
      },
    );
  }

  delete(key) {
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
        return this.anggotaService.delete(key)
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
            this.getAllAnggota();
          }
        });
      }
    })
  }
}