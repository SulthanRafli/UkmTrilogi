import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/services/firebase/admin.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Admin } from 'src/app/models/admin.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {

  public adminForm: FormGroup;
  public isFormEmpty: boolean;
  public filePhoto: File;
  public admin: Admin;

  @ViewChild('photo') photo: ElementRef;

  constructor(
    public authService: AuthService,
    public adminService: AdminService,
    public angularFirestorage: AngularFireStorage,
    public angularFireAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.admin = JSON.parse(localStorage.getItem('admin'));
    this.formValidation();
  }

  formValidation(): void {
    this.adminForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      telp: new FormControl(null, [Validators.required, Validators.pattern('^(^\\+62\\s?|^0)(\\d{3,4}?){2}\\d{3,4}$')]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
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
      this.adminForm.get('fileName').setValue(fileList[0].name);
      this.filePhoto = fileList[0];
    }
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigate(['admin/manage-admin']);
  }

  async save(): Promise<void> {
    if (!this.adminForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;
    }

    const date = Date.now()
    const typeData = this.adminForm.get('fileName').value.substr(this.adminForm.get('fileName').value.lastIndexOf(".") + 1);
    const newFileName = `AdminProfile-${date}.${typeData}`;
    const filePath = `Admin/${newFileName}`;
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
        return this.angularFireAuth.createUserWithEmailAndPassword(this.adminForm.get('email').value, this.adminForm.get('password').value).then(res => {
          uploadTask.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {

                const data = {
                  nama: this.adminForm.get('nama').value,
                  telp: this.adminForm.get('telp').value,
                  email: this.adminForm.get('email').value,
                  password: this.adminForm.get('password').value,
                  fileName: this.adminForm.get('fileName').value,
                  imageUrl: url,
                  dateMake: new Date().getTime()
                }

                this.adminService.create(res.user.uid, data)
                  .then(res => {
                    this.angularFireAuth.signOut();
                    this.authService.login(this.admin.email, this.admin.password);
                  })
                  .catch(error => {
                    Swal.showValidationMessage(
                      `Request failed: ${error}`
                    )
                  });
              })
            })
          ).subscribe()
          return uploadTask.percentageChanges();
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
