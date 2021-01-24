import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Pendaftaran } from 'src/app/models/pendaftaran.model';
import { PendaftaranService } from 'src/app/services/firebase/pendaftaran.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import { Ukm } from 'src/app/models/ukm.model';

@Component({
  selector: 'app-laporan-pendaftaran',
  templateUrl: './laporan-pendaftaran.component.html',
  styleUrls: ['./laporan-pendaftaran.component.scss']
})

export class LaporanPendaftaranComponent implements OnInit {

  public displayedColumns = ['no', 'foto', 'nama', 'jenisKelamin', 'jurusan', 'fakultas', 'tanggalDaftar', 'aksi'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public pendaftaran: Pendaftaran[];
  public loading: boolean;
  public ukm: Ukm;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public pendaftaranService: PendaftaranService,
  ) { }

  ngOnInit(): void {
    this.ukm = JSON.parse(localStorage.getItem('ukm'));
    this.getAllPendaftaran();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllPendaftaran(): void {
    this.loading = true;
    this.pendaftaranService.getAll(this.ukm.id).pipe(
    ).subscribe(
      (data) => {
        this.pendaftaran = data.map(e => {
          return {
            id: e.payload.doc.id,
            idUkm: e.payload.doc.data()['idUkm'],
            namaUkm: e.payload.doc.data()['namaUkm'],
            nomorPendaftaran: e.payload.doc.data()['nomorPendaftaran'],
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
            hobi: e.payload.doc.data()['hobi'],
            bakat: e.payload.doc.data()['bakat'],
            alasan: e.payload.doc.data()['alasan'],
            tanya: e.payload.doc.data()['tanya'],
            tanggalDaftar: e.payload.doc.data()['tanggalDaftar'],
            status: e.payload.doc.data()['status'],
          }
        });
        this.dataSource = new MatTableDataSource(this.pendaftaran);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.pendaftaran.length;
        this.changeDetectorRef.detectChanges();
        this.loading = false;
      },
      (error) => { },
    );
  }
}