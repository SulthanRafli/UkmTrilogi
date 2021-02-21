import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MahasiswaService } from 'src/app/services/firebase/mahasiswa.service';
import { Ukm } from 'src/app/models/ukm.model';
import * as moment from 'moment';

@Component({
  selector: 'app-add-mahasiswa',
  templateUrl: './add-mahasiswa.component.html',
  styleUrls: ['./add-mahasiswa.component.scss']
})
export class AddMahasiswaComponent implements OnInit {

  public mahasiswaForm: FormGroup;
  public isFormEmpty: boolean;

  constructor(
    public mahasiswaService: MahasiswaService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.formValidation();
  }

  formValidation(): void {
    this.mahasiswaForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      jenisKelamin: new FormControl("Laki - laki", [Validators.required]),
      telp: new FormControl(null, [Validators.required, Validators.pattern('^(^\\+62\\s?|^0)(\\d{3,4}?){2}\\d{3,4}$')]),
      tempatLahir: new FormControl(null, [Validators.required]),
      tanggalLahir: new FormControl(null, [Validators.required]),
      jurusan: new FormControl(null, [Validators.required]),
      fakultas: new FormControl("Ekonomi", [Validators.required]),
      alamat: new FormControl(null, [Validators.required]),
      nim: new FormControl(null, [Validators.required])
    });
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigate(['mahasiswa/manage-mahasiswa']);
  }

  async save(): Promise<void> {
    if (!this.mahasiswaForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;


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
          const data = {
            nama: this.mahasiswaForm.get('nama').value,
            email: this.mahasiswaForm.get('email').value,
            jenisKelamin: this.mahasiswaForm.get('jenisKelamin').value,
            telp: this.mahasiswaForm.get('telp').value,
            tempatLahir: this.mahasiswaForm.get('tempatLahir').value,
            tanggalLahir: moment(this.mahasiswaForm.get('tanggalLahir').value).format('YYYY-MM-DD'),
            jurusan: this.mahasiswaForm.get('jurusan').value,
            fakultas: this.mahasiswaForm.get('fakultas').value,
            alamat: this.mahasiswaForm.get('alamat').value,
            nim: this.mahasiswaForm.get('nim').value,
            dateMake: new Date().getTime()
          }

          return this.mahasiswaService.create(data)
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              )
            });
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
