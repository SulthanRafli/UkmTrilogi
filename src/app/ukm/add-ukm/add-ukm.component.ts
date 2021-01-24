import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UkmService } from 'src/app/services/firebase/ukm.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-add-ukm',
  templateUrl: './add-ukm.component.html',
  styleUrls: ['./add-ukm.component.scss']
})
export class AddUkmComponent implements OnInit {

  public ukmForm: FormGroup;
  public isFormEmpty: boolean;
  public fileLogoPhoto: File;
  public fileStrukturPhoto: File;

  @ViewChild('photoLogo') photoLogo: ElementRef;
  @ViewChild('photoStruktur') photoStruktur: ElementRef;

  constructor(
    public ukmService: UkmService,
    public angularFirestorage: AngularFireStorage,
    public angularFireAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.formValidation();
  }

  formValidation(): void {
    this.ukmForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      deskripsi: new FormControl(null, [Validators.required]),
      telp: new FormControl(null, [Validators.required, Validators.pattern('^(^\\+62\\s?|^0)(\\d{3,4}?){2}\\d{3,4}$')]),
      alamat: new FormControl(null, [Validators.required]),
      fileLogoName: new FormControl(null, [Validators.required]),
      fileStrukturName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  getPhotoLogo() {
    if (this.photoLogo == null) {
      return;
    }
    this.photoLogo.nativeElement.click();
  }

  uploadPhotoLogo() {
    if (this.photoLogo == null) {
      return;
    }
    const fileList: any = this.photoLogo.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.ukmForm.get('fileLogoName').setValue(fileList[0].name);
      this.fileLogoPhoto = fileList[0];
    }
  }

  getPhotoStruktur() {
    if (this.photoStruktur == null) {
      return;
    }
    this.photoStruktur.nativeElement.click();
  }

  uploadPhotoStruktur() {
    if (this.photoStruktur == null) {
      return;
    }
    const fileList: any = this.photoStruktur.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.ukmForm.get('fileStrukturName').setValue(fileList[0].name);
      this.fileStrukturPhoto = fileList[0];
    }
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigateByUrl('ukm/manage-ukm');
  }

  async save(): Promise<void> {
    if (!this.ukmForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;
    }

    const dateLogo = Date.now()
    const typeDataLogo = this.ukmForm.get('fileLogoName').value.substr(this.ukmForm.get('fileLogoName').value.lastIndexOf(".") + 1);
    const newFileNameLogo = `UkmLogo-${dateLogo}.${typeDataLogo}`;
    const filePathLogo = `Ukm/${newFileNameLogo}`;
    const fileRefLogo = this.angularFirestorage.ref(filePathLogo);
    const uploadTaskLogo = this.angularFirestorage.upload(filePathLogo, this.fileLogoPhoto);

    const dateStruktur = Date.now()
    const typeDataStruktur = this.ukmForm.get('fileStrukturName').value.substr(this.ukmForm.get('fileStrukturName').value.lastIndexOf(".") + 1);
    const newFileNameStruktur = `UkmStruktur-${dateStruktur}.${typeDataStruktur}`;
    const filePathStruktur = `Ukm/${newFileNameStruktur}`;
    const fileRefStruktur = this.angularFirestorage.ref(filePathStruktur);
    const uploadTaskStruktur = this.angularFirestorage.upload(filePathStruktur, this.fileStrukturPhoto);

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
        return this.angularFireAuth.createUserWithEmailAndPassword(this.ukmForm.get('email').value, this.ukmForm.get('password').value).then(res => {
          uploadTaskLogo.snapshotChanges().pipe(
            finalize(() => {
              fileRefLogo.getDownloadURL().subscribe(urlLogo => {
                uploadTaskStruktur.snapshotChanges().pipe(
                  finalize(() => {
                    fileRefStruktur.getDownloadURL().subscribe(urlStruktur => {

                      const data = {
                        nama: this.ukmForm.get('nama').value,
                        deskripsi: this.ukmForm.get('deskripsi').value,
                        telp: this.ukmForm.get('telp').value,
                        alamat: this.ukmForm.get('alamat').value,
                        fileLogoName: this.ukmForm.get('fileLogoName').value,
                        fileStrukturName: this.ukmForm.get('fileStrukturName').value,
                        email: this.ukmForm.get('email').value,
                        password: this.ukmForm.get('password').value,
                        imageLogoUrl: urlLogo,
                        imageStrukturUrl: urlStruktur,
                        dateMake: new Date().getTime()
                      }

                      this.ukmService.create(res.user.uid, data)
                        .catch(error => {
                          Swal.showValidationMessage(
                            `Request failed: ${error}`
                          )
                        });
                    })
                  })
                ).subscribe()
                return uploadTaskStruktur.percentageChanges();
              })
            })
          ).subscribe()
          return uploadTaskLogo.percentageChanges();
        }).catch(err => {
          Swal.showValidationMessage(
            `Request failed: ${err}`
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
