import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Proker } from 'src/app/models/proker.model';
import { ProkerService } from 'src/app/services/firebase/proker.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-proker',
  templateUrl: './manage-proker.component.html',
  styleUrls: ['./manage-proker.component.scss']
})

export class ManageProkerComponent implements OnInit {

  public displayedColumns = ['no', 'nama', 'namaDivisi', 'tanggal', 'file', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public proker: Proker[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public prokerService: ProkerService,
  ) { }

  ngOnInit(): void {
    this.getAllProker();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllProker(): void {
    this.loading = true;
    this.prokerService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.proker = data.map(e => {
          return {
            id: e.payload.doc.id,
            idUkm: e.payload.doc.data()['idUkm'],
            namaUkm: e.payload.doc.data()['namaUkm'],
            nama: e.payload.doc.data()['nama'],
            namaDivisi: e.payload.doc.data()['namaDivisi'],
            tanggal: e.payload.doc.data()['tanggal'],
            deskripsi: e.payload.doc.data()['deskripsi'],
            fileName: e.payload.doc.data()['fileName'],
            fileUrl: e.payload.doc.data()['fileUrl'],
          }
        });
        this.dataSource = new MatTableDataSource(this.proker);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.proker.length;
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
        return this.prokerService.delete(key)
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
            this.getAllProker();
          }
        });
      }
    })
  }

  downloadMyFile(proker) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', proker.fileUrl);
    link.setAttribute('download', proker.fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}