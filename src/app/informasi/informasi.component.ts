import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Kegiatan } from 'src/app/models/kegiatan.model';
import { KegiatanService } from 'src/app/services/firebase/kegiatan.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informasi',
  templateUrl: './informasi.component.html',
  styleUrls: ['./informasi.component.scss']
})

export class InformasiComponent implements OnInit {

  public displayedColumns = ['no', 'namaUkm', 'nama', 'deskripsi', 'tanggal'];
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
    this.kegiatanService.getAllForUsers().pipe(
    ).subscribe(
      (data) => {
        this.kegiatan = data.map(e => {
          return {
            id: e.payload.doc.id,
            idUkm: e.payload.doc.data()['idUkm'],
            namaUkm: e.payload.doc.data()['namaUkm'],
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
}