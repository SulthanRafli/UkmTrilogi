import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { JadwalPendaftaranService } from 'src/app/services/firebase/jadwal-pendaftaran.service';
import Swal from 'sweetalert2'
import { Ukm } from 'src/app/models/ukm.model';

@Component({
  selector: 'app-add-jadwal-pendaftaran',
  templateUrl: './add-jadwal-pendaftaran.component.html',
  styleUrls: ['./add-jadwal-pendaftaran.component.scss']
})
export class AddJadwalPendaftaranComponent implements OnInit {

  public jadwalPendaftaranForm: FormGroup;
  public isFormEmpty: boolean;
  public ukm: Ukm;

  constructor(
    public formBuilder: FormBuilder,
    public jadwalPendaftaranService: JadwalPendaftaranService,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ukm = JSON.parse(localStorage.getItem('ukm'));
    this.formValidation();
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
        idUkm: this.ukm.id,
        namaUkm: this.ukm.nama,
        nama: this.jadwalPendaftaranForm.get('nama').value,
        tanggalMulai: moment(this.jadwalPendaftaranForm.get('tanggalMulai').value).format('YYYY-MM-DD'),
        tanggalSelesai: moment(this.jadwalPendaftaranForm.get('tanggalSelesai').value).format('YYYY-MM-DD'),
        jamMulai: this.jadwalPendaftaranForm.get('jamMulai').value,
        jamSelesai: this.jadwalPendaftaranForm.get('jamSelesai').value,
        keterangan: this.jadwalPendaftaranForm.get('keterangan').value,
        dateMake: new Date().getTime()
      }

      Swal.fire({
        title: "Anda sudah yakin melakukan penginputan data ?",
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
          return this.jadwalPendaftaranService.create(data)
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
            text: 'Data Berhasil Disimpan',
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
