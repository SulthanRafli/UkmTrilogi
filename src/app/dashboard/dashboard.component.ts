import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CalendarOptions } from '@fullcalendar/angular';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Admin } from '../models/admin.model';
import { Anggota } from '../models/anggota.model';
import { Berita } from '../models/berita.model';
import { Kegiatan } from '../models/kegiatan.model';
import { Ukm } from '../models/ukm.model';
import { AnggotaService } from '../services/firebase/anggota.service';
import { BeritaService } from '../services/firebase/berita.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  toggleProBanner(event) {
    console.log("123");
    event.preventDefault();
    document.querySelector('body').classList.toggle('removeProbanner');
  }

  @ViewChild('infoKegiatan') infoKegiatan;

  public jumlahAnggota: number;
  public jumlahBerita: number;
  public jumlahKegiatan: number;
  public jumlahAdmin: number;
  public jumlahUkm: number;
  public kegiatan: Kegiatan[];
  public admin: Admin;
  public ukm: Ukm;
  public tanggal: string;
  public jamMulai: string;
  public jamSelesai: string;
  public title: string;
  public namaUkm: string;
  public deskripsi: string;
  public isAdministrator: boolean;  
  public loading: boolean;

  constructor(
    public angularFirestore: AngularFirestore,
    public anggotaService: AnggotaService,
    public beritaService: BeritaService,
    public kegiatanService: BeritaService,
    public changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('role') == 'Administrator') {
      this.admin = JSON.parse(localStorage.getItem('admin'));
      this.isAdministrator = true;
      this.getDashboardAdministrator();
    } else {
      this.ukm = JSON.parse(localStorage.getItem('ukm'));
      this.isAdministrator = false;
      this.getDashboardAdminUKM();
    }
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  getDashboardAdminUKM(): void {    
    combineLatest(
      this.angularFirestore.collection<Anggota>('Anggota', ref => ref.where('idUkm', '==', this.ukm.id).orderBy('dateMake', 'desc')).valueChanges(),
      this.angularFirestore.collection<Berita>('Berita', ref => ref.where('idUkm', '==', this.ukm.id).orderBy('dateMake', 'desc')).valueChanges(),
      this.angularFirestore.collection<Kegiatan>('Kegiatan', ref => ref.where('idUkm', '==', this.ukm.id).orderBy('dateMake', 'desc')).valueChanges()
    ).pipe(
      map(([anggota, berita, kegiatan]) => {
        return { anggota, berita, kegiatan };
      })
    ).subscribe((data) => {
      this.jumlahAnggota = data.anggota.length;
      this.jumlahBerita = data.berita.length;
      this.jumlahKegiatan = data.kegiatan.length;      
    });
  }

  getDashboardAdministrator(): void {    
    combineLatest(
      this.angularFirestore.collection<Admin>('Admin', ref => ref.orderBy('dateMake', 'desc')).valueChanges(),
      this.angularFirestore.collection<Ukm>('Ukm', ref => ref.orderBy('dateMake', 'desc')).valueChanges(),
      this.angularFirestore.collection<Kegiatan>('Kegiatan', ref => ref.orderBy('dateMake', 'desc')).valueChanges()
    ).pipe(
      map(([admin, ukm, kegiatan]) => {
        return { admin, ukm, kegiatan };
      })
    ).subscribe((data) => {
      this.jumlahAdmin = data.admin.length;
      this.jumlahUkm = data.ukm.length;
      this.jumlahKegiatan = data.kegiatan.length;      
    });
  }

  calendarOptions: CalendarOptions = {
    customButtons: {
      myCustomButton: {
        text: 'Jadwal Event',
      }
    },
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'myCustomButton',
      center: 'title',
      right: 'today prev,next'
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
    },
    height: 550,
    events: (info, successCallback, failureCallback) => {
      this.loading = true;
      if (localStorage.getItem('role') == 'Administrator') {
        this.angularFirestore.collection<Kegiatan>('Kegiatan', ref => ref.orderBy('dateMake', 'desc')).valueChanges()
          .subscribe((data) => {
            const events = data.map(val => {
              return {
                title: val.nama,
                namaUkm: val.namaUkm,
                start: new Date(val.tanggal + 'T' + val.jamMulai + ':00'),
                end: new Date(val.tanggal + 'T' + val.jamSelesai + ':00'),
                deskripsi: val.deskripsi
              }
            });
            this.loading = false;
            successCallback(events);
          });
      } else {
        this.angularFirestore.collection<Kegiatan>('Kegiatan', ref => ref.where('idUkm', '==', this.ukm.id).orderBy('dateMake', 'desc')).valueChanges()
          .subscribe((data) => {
            const events = data.map(val => {
              return {
                title: val.nama,
                namaUkm: val.namaUkm,
                start: new Date(val.tanggal + 'T' + val.jamMulai + ':00'),
                end: new Date(val.tanggal + 'T' + val.jamSelesai + ':00'),
                deskripsi: val.deskripsi
              }
            });
            this.loading = false;
            successCallback(events);
          });
      }
    },
    eventClick: (info) => {
      this.tanggal = moment(info.event.start).locale("ID").format("D MMMM YYYY");
      this.jamMulai = moment(info.event.start).format("HH:mm");
      this.jamSelesai = moment(info.event.end).format("HH:mm");
      this.title = info.event._def.title;
      this.namaUkm = info.event._def.extendedProps.namaUkm;
      this.deskripsi = info.event._def.extendedProps.deskripsi;

      this.modalService.open(this.infoKegiatan);
    },
  };
}
