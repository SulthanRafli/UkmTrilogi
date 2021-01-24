import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { JadwalPendaftaran } from 'src/app/models/jadwal-pendaftaran.model';
import { JadwalPendaftaranService } from 'src/app/services/firebase/jadwal-pendaftaran.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-jadwal-pendaftaran',
  templateUrl: './manage-jadwal-pendaftaran.component.html',
  styleUrls: ['./manage-jadwal-pendaftaran.component.scss']
})

export class ManageJadwalPendaftaranComponent implements OnInit {

  public displayedColumns = ['no', 'nama', 'tanggalMulai', 'tanggalSelesai', 'jamMulai', 'jamSelesai', 'keterangan', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public jadwalPendaftaran: JadwalPendaftaran[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public jadwalPendaftaranService: JadwalPendaftaranService,
  ) { }

  ngOnInit(): void {
    this.getAllJadwalPendaftaran();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllJadwalPendaftaran(): void {
    this.loading = true;
    this.jadwalPendaftaranService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.jadwalPendaftaran = data.map(e => {
          return {
            id: e.payload.doc.id,
            nama: e.payload.doc.data()['nama'],
            tanggalMulai: e.payload.doc.data()['tanggalMulai'],
            tanggalSelesai: e.payload.doc.data()['tanggalSelesai'],
            jamMulai: e.payload.doc.data()['jamMulai'],
            jamSelesai: e.payload.doc.data()['jamSelesai'],
            keterangan: e.payload.doc.data()['keterangan'],
          }
        });
        this.dataSource = new MatTableDataSource(this.jadwalPendaftaran);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.jadwalPendaftaran.length;
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
        return this.jadwalPendaftaranService.delete(key)
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
            this.getAllJadwalPendaftaran();
          }
        });
      }
    })
  }
}