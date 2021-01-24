import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Pendaftaran } from 'src/app/models/pendaftaran.model';
import { PendaftaranService } from 'src/app/services/firebase/pendaftaran.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-pengumuman',
  templateUrl: './detail-pengumuman.component.html',
  styleUrls: ['./detail-pengumuman.component.scss']
})

export class DetailPengumumanComponent implements OnInit {

  public displayedColumns = ['no', 'nomorPendaftaran', 'foto', 'nama', 'jenisKelamin', 'tanggalDaftar', 'status'];
  public length: number;
  public dataSource: MatTableDataSource<any>;
  public pendaftaran: Pendaftaran[];
  public loading: boolean;
  public key: string;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public activatedRoute: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    public pendaftaranService: PendaftaranService,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.getAllPendaftaran();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getAllPendaftaran(): void {
    this.loading = true;
    this.pendaftaranService.getAll(this.key).pipe(
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