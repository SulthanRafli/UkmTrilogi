import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { KegiatanService } from 'src/app/services/firebase/kegiatan.service';
import Swal from 'sweetalert2'
import { Ukm } from 'src/app/models/ukm.model';

@Component({
  selector: 'app-add-kegiatan',
  templateUrl: './add-kegiatan.component.html',
  styleUrls: ['./add-kegiatan.component.scss']
})
export class AddKegiatanComponent implements OnInit {

  public kegiatanForm: FormGroup;
  public isFormEmpty: boolean;
  public ukm: Ukm;

  constructor(
    public formBuilder: FormBuilder,
    public kegiatanService: KegiatanService,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ukm = JSON.parse(localStorage.getItem('ukm'));
    this.formValidation();
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

  async save(): Promise<void> {
    if (!this.kegiatanForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;

      const data = {
        idUkm: this.ukm.id,
        namaUkm: this.ukm.nama,
        nama: this.kegiatanForm.get('nama').value,
        tanggal: moment(this.kegiatanForm.get('tanggal').value).format('YYYY-MM-DD'),
        jamMulai: this.kegiatanForm.get('jamMulai').value,
        jamSelesai: this.kegiatanForm.get('jamSelesai').value,
        deskripsi: this.kegiatanForm.get('deskripsi').value,
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
          return this.kegiatanService.create(data)
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
