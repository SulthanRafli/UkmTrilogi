import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { KegiatanService } from 'src/app/services/firebase/kegiatan.service';
import Swal from 'sweetalert2'
import { Subject } from 'rxjs';
import { Kegiatan } from 'src/app/models/kegiatan.model';
import { finalize, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubah-kegiatan',
  templateUrl: './ubah-kegiatan.component.html',
  styleUrls: ['./ubah-kegiatan.component.scss']
})
export class UbahKegiatanComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public kegiatanForm: FormGroup;
  public isFormEmpty: boolean;
  public key: string;

  public kegiatan: Kegiatan;
  public loading: boolean;

  constructor(
    public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public kegiatanService: KegiatanService,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getKegiatan();
  }

  formValidation(): void {
    this.kegiatanForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      tanggal: new FormControl(null, [Validators.required]),
      jamMulai: new FormControl(null, [Validators.required]),
      jamSelesai: new FormControl(null, [Validators.required]),
      deskripsi: new FormControl(null, [Validators.required])
    });
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigateByUrl('kegiatan/manage-kegiatan');
  }

  getKegiatan(): void {
    this.loading = true;
    this.kegiatanService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.kegiatan = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.kegiatanForm.get('nama').setValue(this.kegiatan.nama);
    this.kegiatanForm.get('tanggal').setValue(this.kegiatan.tanggal);
    this.kegiatanForm.get('jamMulai').setValue(this.kegiatan.jamMulai);
    this.kegiatanForm.get('jamSelesai').setValue(this.kegiatan.jamSelesai);
    this.kegiatanForm.get('deskripsi').setValue(this.kegiatan.deskripsi);
  }

  async save(): Promise<void> {
    if (!this.kegiatanForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;

      const data = {
        nama: this.kegiatanForm.get('nama').value,
        tanggal: moment(this.kegiatanForm.get('tanggal').value).format('YYYY-MM-DD'),
        jamMulai: this.kegiatanForm.get('jamMulai').value,
        jamSelesai: this.kegiatanForm.get('jamSelesai').value,
        deskripsi: this.kegiatanForm.get('deskripsi').value
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
          return this.kegiatanService.update(this.key, data)
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
