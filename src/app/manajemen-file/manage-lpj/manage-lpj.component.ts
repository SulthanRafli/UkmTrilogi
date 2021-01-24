import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Lpj } from 'src/app/models/lpj.model';
import { LpjService } from 'src/app/services/firebase/lpj.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-lpj',
  templateUrl: './manage-lpj.component.html',
  styleUrls: ['./manage-lpj.component.scss']
})

export class ManageLpjComponent implements OnInit {

  public displayedColumns = ['no', 'judul', 'namaDivisi', 'tanggalPeriode', 'file', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public lpj: Lpj[];
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public lpjService: LpjService,
  ) { }

  ngOnInit(): void {
    this.getAllLpj();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllLpj(): void {
    this.loading = true;
    this.lpjService.getAll().pipe(
    ).subscribe(
      (data) => {
        this.lpj = data.map(e => {
          return {
            id: e.payload.doc.id,
            idUkm: e.payload.doc.data()['idUkm'],
            namaUkm: e.payload.doc.data()['namaUkm'],
            judul: e.payload.doc.data()['judul'],
            namaDivisi: e.payload.doc.data()['namaDivisi'],
            tanggalPeriode: e.payload.doc.data()['tanggalPeriode'],
            fileName: e.payload.doc.data()['fileName'],
            fileUrl: e.payload.doc.data()['fileUrl'],
          }
        });
        this.dataSource = new MatTableDataSource(this.lpj);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.lpj.length;
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
        return this.lpjService.delete(key)
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
            this.getAllLpj();
          }
        });
      }
    })
  }

  downloadMyFile(lpj) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', lpj.fileUrl);
    link.setAttribute('download', lpj.fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}