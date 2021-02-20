import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { JadwalPertemuanService } from 'src/app/services/firebase/jadwal-pertemuan.service';
import Swal from 'sweetalert2'
import { Ukm } from 'src/app/models/ukm.model';

@Component({
  selector: 'app-add-jadwal-pertemuan',
  templateUrl: './add-jadwal-pertemuan.component.html',
  styleUrls: ['./add-jadwal-pertemuan.component.scss']
})
export class AddJadwalPertemuanComponent implements OnInit {

  public jadwalPertemuanForm: FormGroup;
  public isFormEmpty: boolean;
  public ukm: Ukm;

  constructor(
    public formBuilder: FormBuilder,
    public jadwalPertemuanService: JadwalPertemuanService,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ukm = JSON.parse(localStorage.getItem('ukm'));
    this.formValidation();
  }

  formValidation(): void {
    this.jadwalPertemuanForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      tanggal: new FormControl(null, [Validators.required]),      
      jamMulai: new FormControl(null, [Validators.required]),
      jamSelesai: new FormControl(null, [Validators.required]),
      keterangan: new FormControl(null, [Validators.required])
    });
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
        idUkm: this.ukm.id,
        namaUkm: this.ukm.nama,
        nama: this.jadwalPertemuanForm.get('nama').value,
        tanggal: moment(this.jadwalPertemuanForm.get('tanggal').value).format('YYYY-MM-DD'),        
        jamMulai: this.jadwalPertemuanForm.get('jamMulai').value,
        jamSelesai: this.jadwalPertemuanForm.get('jamSelesai').value,
        keterangan: this.jadwalPertemuanForm.get('keterangan').value,
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
          return this.jadwalPertemuanService.create(data)
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
