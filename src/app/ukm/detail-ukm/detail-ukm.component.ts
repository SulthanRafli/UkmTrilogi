import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import { combineLatest, Subject, throwError } from 'rxjs';
import { Ukm } from 'src/app/models/ukm.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Anggota } from 'src/app/models/anggota.model';
import { Kegiatan } from 'src/app/models/kegiatan.model';
import { Lpj } from 'src/app/models/lpj.model';
import { Proker } from 'src/app/models/proker.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-detail-ukm',
  templateUrl: './detail-ukm.component.html',
  styleUrls: ['./detail-ukm.component.scss']
})
export class DetailUkmComponent implements OnInit {

  public key: string;
  public unsubscribe$ = new Subject<void>();
  public ukm: Ukm;

  public displayedColumnsAnggota = ['no', 'foto', 'nama', 'jenisKelamin', 'jurusan', 'fakultas'];
  public lengthAnggota: number;
  public dataSourceAnggota: MatTableDataSource<any>;

  public displayedColumnsKegiatan = ['no', 'nama', 'tanggal', 'jamMulai', 'jamSelesai', 'deskripsi'];
  public lengthKegiatan: number;
  public dataSourceKegiatan: MatTableDataSource<any>;

  public displayedColumnsLpj = ['no', 'judul', 'namaDivisi', 'tanggalPeriode', 'file'];
  public lengthLpj: number;
  public dataSourceLpj: MatTableDataSource<any>;

  public displayedColumnsProker = ['no', 'nama', 'namaDivisi', 'tanggal', 'file'];
  public lengthProker: number;
  public dataSourceProker: MatTableDataSource<any>;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  public loading: boolean;

  @ViewChild('paginatorAnggota', { read: MatPaginator }) paginatorAnggota: MatPaginator;
  @ViewChild('sortAnggota') sortAnggota: MatSort;
  @ViewChild('paginatorKegiatan', { read: MatPaginator }) paginatorKegiatan: MatPaginator;
  @ViewChild('sortKegiatan') sortKegiatan: MatSort;
  @ViewChild('paginatorLpj', { read: MatPaginator }) paginatorLpj: MatPaginator;
  @ViewChild('sortLpj') sortLpj: MatSort;
  @ViewChild('paginatorProker', { read: MatPaginator }) paginatorProker: MatPaginator;
  @ViewChild('sortProker') sortProker: MatSort;

  constructor(
    public angularFirestore: AngularFirestore,
    public changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public angularFireAuth: AngularFireAuth,
    public location: Location,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.getDetailAdminUKM();
  }

  getDetailAdminUKM(): void {
    this.loading = true;
    combineLatest(
      this.angularFirestore.collection<Ukm>('Ukm').doc(this.key).valueChanges(),
      this.angularFirestore.collection<Anggota>('Anggota', ref => ref.where('idUkm', '==', this.key).orderBy('dateMake', 'desc')).valueChanges(),
      this.angularFirestore.collection<Kegiatan>('Kegiatan', ref => ref.where('idUkm', '==', this.key).orderBy('dateMake', 'desc')).valueChanges(),
      this.angularFirestore.collection<Lpj>('Lpj', ref => ref.where('idUkm', '==', this.key).orderBy('dateMake', 'desc')).valueChanges(),
      this.angularFirestore.collection<Proker>('Proker', ref => ref.where('idUkm', '==', this.key).orderBy('dateMake', 'desc')).valueChanges()
    ).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }),
      map(([ukm, anggota, kegiatan, lpj, proker]) => {
        return { ukm, anggota, kegiatan, lpj, proker };
      })
    ).subscribe((data) => {
      this.ukm = data.ukm;

      this.dataSourceAnggota = new MatTableDataSource(data.anggota);
      this.dataSourceAnggota.paginator = this.paginatorAnggota;
      this.dataSourceAnggota.sort = this.sortAnggota;
      this.lengthAnggota = data.anggota.length;

      this.dataSourceKegiatan = new MatTableDataSource(data.kegiatan);
      this.dataSourceKegiatan.paginator = this.paginatorKegiatan;
      this.dataSourceKegiatan.sort = this.sortKegiatan;
      this.lengthKegiatan = data.kegiatan.length;

      this.dataSourceLpj = new MatTableDataSource(data.lpj);
      this.dataSourceLpj.paginator = this.paginatorLpj;
      this.dataSourceLpj.sort = this.sortLpj;
      this.lengthLpj = data.lpj.length;

      this.dataSourceProker = new MatTableDataSource(data.proker);
      this.dataSourceProker.paginator = this.paginatorProker;
      this.dataSourceProker.sort = this.sortProker;
      this.lengthProker = data.proker.length;

      this.loading = false;

      this.changeDetectorRef.detectChanges();
    });
  }

  back(): void {
    this.location.back();
  }

  applyFilterAnggota(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceAnggota.filter = filterValue;
  }

  applyFilterKegiatan(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceKegiatan.filter = filterValue;
  }

  applyFilterLpj(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceLpj.filter = filterValue;
  }

  applyFilterProker(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceProker.filter = filterValue;
  }

  downloadLogo() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', this.ukm.imageLogoUrl);
    link.setAttribute('download', this.ukm.fileLogoName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  downloadStruktur() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', this.ukm.imageStrukturUrl);
    link.setAttribute('download', this.ukm.fileStrukturName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
