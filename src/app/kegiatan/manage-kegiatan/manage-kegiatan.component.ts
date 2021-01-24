import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Kegiatan } from 'src/app/models/kegiatan.model';
import { KegiatanService } from 'src/app/services/firebase/kegiatan.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-kegiatan',
  templateUrl: './manage-kegiatan.component.html',
  styleUrls: ['./manage-kegiatan.component.scss']
})

export class ManageKegiatanComponent implements OnInit {  

  public displayedColumns = ['no', 'nama', 'tanggal', 'jamMulai', 'jamSelesai', 'deskripsi', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public kegiatan: Kegiatan[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public kegiatanService: KegiatanService,
  ) { }

  ngOnInit(): void {
    this.getAllKegiatan();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllKegiatan(): void {
    this.loading = true;
    this.kegiatanService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.kegiatan = data.map(e => {
          return {
            id: e.payload.doc.id,
            nama: e.payload.doc.data()['nama'],
            tanggal: e.payload.doc.data()['tanggal'],
            jamMulai: e.payload.doc.data()['jamMulai'],
            jamSelesai: e.payload.doc.data()['jamSelesai'],
            deskripsi: e.payload.doc.data()['deskripsi'],
          }
        });
        this.dataSource = new MatTableDataSource(this.kegiatan);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.kegiatan.length;
        this.changeDetectorRef.detectChanges();
        this.loading = false;
      },
      (error) => { },
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
        return this.kegiatanService.delete(key)
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
            this.getAllKegiatan();
          }
        });
      }
    })
  }
}