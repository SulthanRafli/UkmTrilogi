import { OnInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Pendaftaran } from 'src/app/models/pendaftaran.model';
import { PendaftaranService } from 'src/app/services/firebase/pendaftaran.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading'
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JadwalPertemuanService } from 'src/app/services/firebase/jadwal-pertemuan.service';
import { JadwalPertemuan } from 'src/app/models/jadwal-pertemuan.model';

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
  public jadwalPertemuan: JadwalPertemuan[];
  public loading: boolean;
  public key: string;
  public nama: string;  
  public tanggal: string;  
  public jamMulai: string;
  public jamSelesai: string;
  public keterangan: string;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild('infoJadwal') infoJadwal;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public activatedRoute: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    public pendaftaranService: PendaftaranService,
    public jadwalPertemuanService: JadwalPertemuanService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.getAllPendaftaran();
    this.getJadwalPertemuan();
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

  getJadwalPertemuan(): void {
    this.loading = true;
    this.jadwalPertemuanService.getAllByUkm(this.key).pipe(
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
        if(this.jadwalPertemuan.length !== 0){
          this.nama = this.jadwalPertemuan[0].nama;    
          this.tanggal = this.jadwalPertemuan[0].tanggal;        
          this.jamMulai = this.jadwalPertemuan[0].jamMulai;
          this.jamSelesai = this.jadwalPertemuan[0].jamSelesai;
          this.keterangan = this.jadwalPertemuan[0].keterangan;
        }        
        this.loading = false;
      },
      (error) => { },
    );
  }

  openModal() {
    this.modalService.open(this.infoJadwal);
  }
}