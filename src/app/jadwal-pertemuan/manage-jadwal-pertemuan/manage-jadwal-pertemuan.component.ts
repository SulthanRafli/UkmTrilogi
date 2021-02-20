import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { JadwalPertemuan } from 'src/app/models/jadwal-pertemuan.model';
import { JadwalPertemuanService } from 'src/app/services/firebase/jadwal-pertemuan.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-jadwal-pertemuan',
  templateUrl: './manage-jadwal-pertemuan.component.html',
  styleUrls: ['./manage-jadwal-pertemuan.component.scss']
})

export class ManageJadwalPertemuanComponent implements OnInit {

  public displayedColumns = ['no', 'nama', 'tanggal', 'jamMulai', 'jamSelesai', 'keterangan', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public jadwalPertemuan: JadwalPertemuan[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public jadwalPertemuanService: JadwalPertemuanService,
  ) { }

  ngOnInit(): void {
    this.getAllJadwalPertemuan();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllJadwalPertemuan(): void {
    this.loading = true;
    this.jadwalPertemuanService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.jadwalPertemuan = data.map(e => {
          return {
            id: e.payload.doc.id,
            nama: e.payload.doc.data()['nama'],
            tanggal: e.payload.doc.data()['tanggal'],            
            jamMulai: e.payload.doc.data()['jamMulai'],
            jamSelesai: e.payload.doc.data()['jamSelesai'],
            keterangan: e.payload.doc.data()['keterangan'],
          }
        });
        this.dataSource = new MatTableDataSource(this.jadwalPertemuan);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.jadwalPertemuan.length;
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
        return this.jadwalPertemuanService.delete(key)
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
            this.getAllJadwalPertemuan();
          }
        });
      }
    })
  }
}