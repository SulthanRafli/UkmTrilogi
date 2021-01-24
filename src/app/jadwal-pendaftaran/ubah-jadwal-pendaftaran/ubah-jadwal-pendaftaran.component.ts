import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { JadwalPendaftaranService } from 'src/app/services/firebase/jadwal-pendaftaran.service';
import Swal from 'sweetalert2'
import { Subject } from 'rxjs';
import { JadwalPendaftaran } from 'src/app/models/jadwal-pendaftaran.model';
import { finalize, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubah-jadwal-pendaftaran',
  templateUrl: './ubah-jadwal-pendaftaran.component.html',
  styleUrls: ['./ubah-jadwal-pendaftaran.component.scss']
})
export class UbahJadwalPendaftaranComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public jadwalPendaftaranForm: FormGroup;
  public isFormEmpty: boolean;
  public key: string;

  public jadwalPendaftaran: JadwalPendaftaran;
  public loading: boolean;

  constructor(
    public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public jadwalPendaftaranService: JadwalPendaftaranService,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getJadwalPendaftaran();
  }

  formValidation(): void {
    this.jadwalPendaftaranForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      tanggalMulai: new FormControl(null, [Validators.required]),
      tanggalSelesai: new FormControl(null, [Validators.required]),
      jamMulai: new FormControl(null, [Validators.required]),
      jamSelesai: new FormControl(null, [Validators.required]),
      keterangan: new FormControl(null, [Validators.required])
    });
  }

  getJadwalPendaftaran(): void {
    this.loading = true;
    this.jadwalPendaftaranService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.jadwalPendaftaran = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.jadwalPendaftaranForm.get('nama').setValue(this.jadwalPendaftaran.nama);
    this.jadwalPendaftaranForm.get('tanggalMulai').setValue(this.jadwalPendaftaran.tanggalMulai);
    this.jadwalPendaftaranForm.get('tanggalSelesai').setValue(this.jadwalPendaftaran.tanggalSelesai);
    this.jadwalPendaftaranForm.get('jamMulai').setValue(this.jadwalPendaftaran.jamMulai);
    this.jadwalPendaftaranForm.get('jamSelesai').setValue(this.jadwalPendaftaran.jamSelesai);
    this.jadwalPendaftaranForm.get('keterangan').setValue(this.jadwalPendaftaran.keterangan);
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigateByUrl('jadwal-pendaftaran/manage-jadwal-pendaftaran');
  }

  async save(): Promise<void> {
    if (!this.jadwalPendaftaranForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;

      const data = {
        nama: this.jadwalPendaftaranForm.get('nama').value,
        tanggalMulai: moment(this.jadwalPendaftaranForm.get('tanggalMulai').value).format('YYYY-MM-DD'),
        tanggalSelesai: moment(this.jadwalPendaftaranForm.get('tanggalSelesai').value).format('YYYY-MM-DD'),
        jamMulai: this.jadwalPendaftaranForm.get('jamMulai').value,
        jamSelesai: this.jadwalPendaftaranForm.get('jamSelesai').value,
        keterangan: this.jadwalPendaftaranForm.get('keterangan').value,
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
          return this.jadwalPendaftaranService.update(this.key, data)
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
