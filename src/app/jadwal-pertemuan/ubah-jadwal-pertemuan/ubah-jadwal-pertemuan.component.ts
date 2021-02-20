import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { JadwalPertemuanService } from 'src/app/services/firebase/jadwal-pertemuan.service';
import Swal from 'sweetalert2'
import { Subject } from 'rxjs';
import { JadwalPertemuan } from 'src/app/models/jadwal-pertemuan.model';
import { finalize, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubah-jadwal-pertemuan',
  templateUrl: './ubah-jadwal-pertemuan.component.html',
  styleUrls: ['./ubah-jadwal-pertemuan.component.scss']
})
export class UbahJadwalPertemuanComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public jadwalPertemuanForm: FormGroup;
  public isFormEmpty: boolean;
  public key: string;

  public jadwalPertemuan: JadwalPertemuan;
  public loading: boolean;

  constructor(
    public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public jadwalPertemuanService: JadwalPertemuanService,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getJadwalPertemuan();
  }

  formValidation(): void {
    this.jadwalPertemuanForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      tanggalMulai: new FormControl(null, [Validators.required]),
      tanggalSelesai: new FormControl(null, [Validators.required]),
      jamMulai: new FormControl(null, [Validators.required]),
      jamSelesai: new FormControl(null, [Validators.required]),
      keterangan: new FormControl(null, [Validators.required])
    });
  }

  getJadwalPertemuan(): void {
    this.loading = true;
    this.jadwalPertemuanService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.jadwalPertemuan = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.jadwalPertemuanForm.get('nama').setValue(this.jadwalPertemuan.nama);
    this.jadwalPertemuanForm.get('tanggalMulai').setValue(this.jadwalPertemuan.tanggalMulai);
    this.jadwalPertemuanForm.get('tanggalSelesai').setValue(this.jadwalPertemuan.tanggalSelesai);
    this.jadwalPertemuanForm.get('jamMulai').setValue(this.jadwalPertemuan.jamMulai);
    this.jadwalPertemuanForm.get('jamSelesai').setValue(this.jadwalPertemuan.jamSelesai);
    this.jadwalPertemuanForm.get('keterangan').setValue(this.jadwalPertemuan.keterangan);
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigateByUrl('jadwal-pertemuan/manage-jadwal-pertemuan');
  }

  async save(): Promise<void> {
    if (!this.jadwalPertemuanForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;

      const data = {
        nama: this.jadwalPertemuanForm.get('nama').value,
        tanggalMulai: moment(this.jadwalPertemuanForm.get('tanggalMulai').value).format('YYYY-MM-DD'),
        tanggalSelesai: moment(this.jadwalPertemuanForm.get('tanggalSelesai').value).format('YYYY-MM-DD'),
        jamMulai: this.jadwalPertemuanForm.get('jamMulai').value,
        jamSelesai: this.jadwalPertemuanForm.get('jamSelesai').value,
        keterangan: this.jadwalPertemuanForm.get('keterangan').value,
      }

      Swal.fire({
        title: "Anda sudah yakin melakukan perubahan data ?",
        text: "Pastikan data yang diinput benar!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Iya',
        cancelButtonText: 'Tidak',
        confirmButtonColor: '#07cdae',
        cancelButtonColor: '#fe7096',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.jadwalPertemuanService.update(this.key, data)
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
            text: 'Data Berhasil Diperbarui',
            confirmButtonColor: '#07cdae',
          }).then((result) => {
            if (result.value) {
              this.redirectToManage();
            }
          });
        }
      })
    }
  }
}
