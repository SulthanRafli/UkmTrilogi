import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AnggotaService } from 'src/app/services/firebase/anggota.service';
import { Ukm } from 'src/app/models/ukm.model';
import * as moment from 'moment';

@Component({
  selector: 'app-add-anggota',
  templateUrl: './add-anggota.component.html',
  styleUrls: ['./add-anggota.component.scss']
})
export class AddAnggotaComponent implements OnInit {

  public anggotaForm: FormGroup;
  public isFormEmpty: boolean;
  public filePhoto: File;
  public ukm: Ukm;

  @ViewChild('photo') photo: ElementRef;

  constructor(
    public anggotaService: AnggotaService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.ukm = JSON.parse(localStorage.getItem('ukm'));
    this.formValidation();
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
        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {

              const data = {
                idUkm: this.ukm.id,
                namaUkm: this.ukm.nama,
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
                imageUrl: url,
                dateMake: new Date().getTime()
              }

              this.anggotaService.create(data)
                .catch(error => {
                  Swal.showValidationMessage(
                    `Request failed: ${error}`
                  )
                });
            });
          })
        ).subscribe();
        return uploadTask.percentageChanges();
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
