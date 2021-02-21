import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MahasiswaService } from 'src/app/services/firebase/mahasiswa.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Mahasiswa } from 'src/app/models/mahasiswa.model';

@Component({
  selector: 'app-ubah-mahasiswa',
  templateUrl: './ubah-mahasiswa.component.html',
  styleUrls: ['./ubah-mahasiswa.component.scss']
})
export class UbahMahasiswaComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public mahasiswaForm: FormGroup;
  public isFormEmpty: boolean;

  public key: string;

  public mahasiswa: Mahasiswa;
  public loading: boolean;

  constructor(
    public activatedRoute: ActivatedRoute,
    public mahasiswaService: MahasiswaService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getMahasiswa();
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

  getMahasiswa(): void {
    this.loading = true;
    this.mahasiswaService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.mahasiswa = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.mahasiswaForm.get('nama').setValue(this.mahasiswa.nama);
    this.mahasiswaForm.get('email').setValue(this.mahasiswa.email);
    this.mahasiswaForm.get('jenisKelamin').setValue(this.mahasiswa.jenisKelamin);
    this.mahasiswaForm.get('telp').setValue(this.mahasiswa.telp);
    this.mahasiswaForm.get('tempatLahir').setValue(this.mahasiswa.tempatLahir);
    this.mahasiswaForm.get('tanggalLahir').setValue(this.mahasiswa.tanggalLahir);
    this.mahasiswaForm.get('jurusan').setValue(this.mahasiswa.jurusan);
    this.mahasiswaForm.get('fakultas').setValue(this.mahasiswa.fakultas);
    this.mahasiswaForm.get('alamat').setValue(this.mahasiswa.alamat);
    this.mahasiswaForm.get('nim').setValue(this.mahasiswa.nim);
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
        title: "Anda Anda sudah yakin melakukan perubahan data ?",
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
          }

          return this.mahasiswaService.update(this.key, data)
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
