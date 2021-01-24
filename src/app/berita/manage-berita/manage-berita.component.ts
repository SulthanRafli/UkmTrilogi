import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Berita } from 'src/app/models/berita.model';
import { BeritaService } from 'src/app/services/firebase/berita.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-berita',
  templateUrl: './manage-berita.component.html',
  styleUrls: ['./manage-berita.component.scss']
})

export class ManageBeritaComponent implements OnInit {

  public displayedColumns = ['no', 'fotoSampul', 'judul', 'kategoriUkm', 'namaPenulis', 'tanggalUpload', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public berita: Berita[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public beritaService: BeritaService,
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getAllBerita();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllBerita(): void {
    this.loading = true;
    this.beritaService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.berita = data.map(e => {
          return {
            id: e.payload.doc.id,
            idUkm: e.payload.doc.data()['idUkm'],
            namaUkm: e.payload.doc.data()['namaUkm'],
            judul: e.payload.doc.data()['judul'],            
            isiBerita: e.payload.doc.data()['isiBerita'],
            namaPenulis: e.payload.doc.data()['namaPenulis'],
            tanggalUpload: e.payload.doc.data()['tanggalUpload'],
            fileName: e.payload.doc.data()['fileName'],
            imageUrl: e.payload.doc.data()['imageUrl'],
          }
        });
        this.dataSource = new MatTableDataSource(this.berita);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.berita.length;
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
        return this.beritaService.delete(key)
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
            this.getAllBerita();
          }
        });
      }
    })
  }
}