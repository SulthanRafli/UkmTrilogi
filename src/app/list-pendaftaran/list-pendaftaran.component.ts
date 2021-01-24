import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { finalize, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { JadwalPendaftaran } from '../models/jadwal-pendaftaran.model';
import { Ukm } from '../models/ukm.model';
import { JadwalPendaftaranService } from '../services/firebase/jadwal-pendaftaran.service';
import { UkmService } from '../services/firebase/ukm.service';
import * as moment from 'moment';
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-list-pendaftaran',
  templateUrl: './list-pendaftaran.component.html',
  styleUrls: ['./list-pendaftaran.component.scss']
})
export class ListPendaftaranComponent implements OnInit {

  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  public ukm: Ukm;
  public jadwalPendaftaran: JadwalPendaftaran[];
  public loading: boolean;
  public today = moment();

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor(
    public angularFirestore: AngularFirestore,
    public ukmService: UkmService,
    public jadwalPendaftaranService: JadwalPendaftaranService,
  ) { }

  ngOnInit(): void {
    this.getAllJadwalPendaftaran();
  }

  getAllJadwalPendaftaran() {
    this.loading = true;
    this.angularFirestore.collection<JadwalPendaftaran>('JadwalPendaftaran').valueChanges()
      .pipe(
        switchMap(jadwalPendaftarans => {
          const idUkms = (jadwalPendaftarans.map(jp => jp.idUkm))
          return combineLatest(
            of(jadwalPendaftarans),
            combineLatest(
              idUkms.map(idUkm =>
                this.angularFirestore.collection<Ukm>('Ukm').doc(idUkm).valueChanges().pipe(
                  map(res => {
                    return {
                      id: idUkm,
                      ...res,
                    }
                  })
                )
              )
            )
          )
        }),
        map(([jadwalPendaftarans, ukm]) => {          
          return jadwalPendaftarans.map(jadwalPendaftaran => {
            var status;
            var leftTime = 0;
            if (!(this.today.startOf('day').isBefore(moment(jadwalPendaftaran.tanggalMulai)) || this.today.startOf('day').isAfter(moment(jadwalPendaftaran.tanggalSelesai)))) {

              let today = moment().format("YYYY-MM-DD"),
                tanggalJamMulai = moment(today),
                tanggalJamSelesai = moment(today),
                timeMulai = moment(jadwalPendaftaran.jamMulai, 'HH:mm'),
                timeSelesai = moment(jadwalPendaftaran.jamSelesai, 'HH:mm');

              tanggalJamMulai.set({
                hour: timeMulai.get('hour'),
                minute: timeMulai.get('minute'),
                second: timeMulai.get('second')
              });

              tanggalJamSelesai.set({
                hour: timeSelesai.get('hour'),
                minute: timeSelesai.get('minute'),
                second: timeSelesai.get('second')
              });

              if (!(moment().isBefore(tanggalJamMulai) || moment().isAfter(tanggalJamSelesai))) {
                status = false;
                let duration = moment.duration(tanggalJamSelesai.diff(moment()));
                let fromSeconds = Math.floor(duration.asSeconds());

                leftTime = fromSeconds;

              } else {
                status = true;
              }

            } else {
              status = true;
            }
            return {
              ...jadwalPendaftaran,
              status: status,
              leftTime: leftTime,
              ukm: ukm.find(a => a.id === jadwalPendaftaran.idUkm)
            }
          })
        })
      ).subscribe((data) => {
        this.loading = false;
        this.jadwalPendaftaran = data;
      })
  }

  onTimerFinished(e: Event) {
    if (e["action"] == "done") {
      location.reload();
    }
  }
}
