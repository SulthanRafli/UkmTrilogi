import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Mahasiswa } from 'src/app/models/mahasiswa.model';
import { MahasiswaService } from 'src/app/services/firebase/mahasiswa.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-mahasiswa',
  templateUrl: './manage-mahasiswa.component.html',
  styleUrls: ['./manage-mahasiswa.component.scss']
})

export class ManageMahasiswaComponent implements OnInit {

  public displayedColumns = ['no', 'nim', 'nama', 'jenisKelamin', 'jurusan', 'fakultas', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public mahasiswa: Mahasiswa[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public mahasiswaService: MahasiswaService,
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getAllMahasiswa();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllMahasiswa(): void {
    this.loading = true;
    this.mahasiswaService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.mahasiswa = data.map(e => {
          return {
            id: e.payload.doc.id,            
            nama: e.payload.doc.data()['nama'],
            nim: e.payload.doc.data()['nim'],       
            tempatLahir: e.payload.doc.data()['tempatLahir'],
            tanggalLahir: e.payload.doc.data()['tanggalLahir'],
            jurusan: e.payload.doc.data()['jurusan'],
            fakultas: e.payload.doc.data()['fakultas'],
            alamat: e.payload.doc.data()['alamat'],
            jenisKelamin: e.payload.doc.data()['jenisKelamin'],
            email: e.payload.doc.data()['email'],
            telp: e.payload.doc.data()['telp'],                 
          }
        });
        this.dataSource = new MatTableDataSource(this.mahasiswa);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.mahasiswa.length;
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
        return this.mahasiswaService.delete(key)
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
            this.getAllMahasiswa();
          }
        });
      }
    })
  }
}