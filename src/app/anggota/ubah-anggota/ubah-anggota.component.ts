import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AnggotaService } from 'src/app/services/firebase/anggota.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Anggota } from 'src/app/models/anggota.model';

@Component({
  selector: 'app-ubah-anggota',
  templateUrl: './ubah-anggota.component.html',
  styleUrls: ['./ubah-anggota.component.scss']
})
export class UbahAnggotaComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public anggotaForm: FormGroup;
  public isFormEmpty: boolean;
  public filePhoto: File;

  public key: string;

  public anggota: Anggota;
  public loading: boolean;

  @ViewChild('photo') photo: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public anggotaService: AnggotaService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getAnggota();
  }

  formValidation(): void {
    this.anggotaForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      jenisKelamin: new FormControl("Laki - laki", [Validators.required]),
      telp: new FormControl(null, [Validators.required, Validators.pattern('^(^\\+62\\s?|^0)(\\d{3,4}?){2}\\d{3,4}$')]),
      tempatLahir: new FormControl(null, [Validators.required]),
      tanggalLahir: new FormControl(null, [Validators.required]),
      jurusan: new FormControl(null, [Validators.required]),
      fakultas: new FormControl("Ekonomi", [Validators.required]),
      alamat: new FormControl(null, [Validators.required]),
      fileName: new FormControl(null, [Validators.required])
    });
  }

  getAnggota(): void {
    this.loading = true;
    this.anggotaService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.anggota = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.anggotaForm.get('nama').setValue(this.anggota.nama);
    this.anggotaForm.get('email').setValue(this.anggota.email);
    this.anggotaForm.get('jenisKelamin').setValue(this.anggota.jenisKelamin);
    this.anggotaForm.get('telp').setValue(this.anggota.telp);
    this.anggotaForm.get('tempatLahir').setValue(this.anggota.tempatLahir);
    this.anggotaForm.get('tanggalLahir').setValue(this.anggota.tanggalLahir);
    this.anggotaForm.get('jurusan').setValue(this.anggota.jurusan);
    this.anggotaForm.get('fakultas').setValue(this.anggota.fakultas);
    this.anggotaForm.get('alamat').setValue(this.anggota.alamat);
    this.anggotaForm.get('fileName').setValue(this.anggota.fileName);
  }

  getPhoto() {
    if (this.photo == null) {
      return;
    }
    this.photo.nativeElement.click();
  }

  uploadPhoto() {
    if (this.photo == null) {
      return;
    }
    const fileList: any = this.photo.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.anggotaForm.get('fileName').setValue(fileList[0].name);
      this.filePhoto = fileList[0];
    }
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigate(['anggota/manage-anggota']);
  }

  async save(): Promise<void> {
    if (!this.anggotaForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;
    }

    const date = Date.now()
    const typeData = this.anggotaForm.get('fileName').value.substr(this.anggotaForm.get('fileName').value.lastIndexOf(".") + 1);
    const newFileName = `AnggotaProfile-${date}.${typeData}`;
    const filePath = `Anggota/${newFileName}`;
    const fileRef = this.angularFirestorage.ref(filePath);
    const uploadTask = this.angularFirestorage.upload(filePath, this.filePhoto);

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
        if (this.filePhoto !== undefined) {
          uploadTask.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {

                const data = {
                  nama: this.anggotaForm.get('nama').value,
                  email: this.anggotaForm.get('email').value,
                  jenisKelamin: this.anggotaForm.get('jenisKelamin').value,
                  telp: this.anggotaForm.get('telp').value,
                  tempatLahir: this.anggotaForm.get('tempatLahir').value,
                  tanggalLahir: moment(this.anggotaForm.get('tanggalLahir').value).format('YYYY-MM-DD'),
                  jurusan: this.anggotaForm.get('jurusan').value,
                  fakultas: this.anggotaForm.get('fakultas').value,
                  alamat: this.anggotaForm.get('alamat').value,
                  fileName: this.anggotaForm.get('fileName').value,
                  imageUrl: url
                }

                this.anggotaService.update(this.key, data)
                  .catch(error => {
                    Swal.showValidationMessage(
                      `Request failed: ${error}`
                    )
                  });
              });
            })
          ).subscribe();
          return uploadTask.percentageChanges();
        } else {

          const data = {
            nama: this.anggotaForm.get('nama').value,
            email: this.anggotaForm.get('email').value,
            jenisKelamin: this.anggotaForm.get('jenisKelamin').value,
            telp: this.anggotaForm.get('telp').value,
            tempatLahir: this.anggotaForm.get('tempatLahir').value,
            tanggalLahir: moment(this.anggotaForm.get('tanggalLahir').value).format('YYYY-MM-DD'),
            jurusan: this.anggotaForm.get('jurusan').value,
            fakultas: this.anggotaForm.get('fakultas').value,
            alamat: this.anggotaForm.get('alamat').value,
          }

          return this.anggotaService.update(this.key, data)
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              )
            });
        }
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
