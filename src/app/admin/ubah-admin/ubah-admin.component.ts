import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/services/firebase/admin.service';
import { Admin } from 'src/app/models/admin.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubah-admin',
  templateUrl: './ubah-admin.component.html',
  styleUrls: ['./ubah-admin.component.scss']
})
export class UbahAdminComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public adminForm: FormGroup;
  public isFormEmpty: boolean;
  public filePhoto: File;
  public key: string;

  public admin: Admin;
  public loading: boolean;

  @ViewChild('photo') photo: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public adminService: AdminService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getAdmin();
  }

  formValidation(): void {
    this.adminForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      telp: new FormControl(null, [Validators.required, Validators.pattern('^(^\\+62\\s?|^0)(\\d{3,4}?){2}\\d{3,4}$')]),
      email: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.email]),
      password: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.minLength(6)]),
      fileName: new FormControl(null, [Validators.required])
    });
  }

  getAdmin(): void {
    this.loading = true;
    this.adminService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.admin = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.adminForm.get('nama').setValue(this.admin.nama);
    this.adminForm.get('email').setValue(this.admin.email);
    this.adminForm.get('password').setValue(this.admin.password);
    this.adminForm.get('telp').setValue(this.admin.telp);
    this.adminForm.get('fileName').setValue(this.admin.fileName);
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
    this.router.navigateByUrl('admin/manage-admin');
  }

  async save(): Promise<void> {
    if (!this.adminForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;

      const date = Date.now()
      const typeData = this.adminForm.get('fileName').value.substr(this.adminForm.get('fileName').value.lastIndexOf(".") + 1);
      const newFileName = `${date}.${typeData}`;
      const filePath = `Admin/${newFileName}`;
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
                    nama: this.adminForm.get('nama').value,
                    telp: this.adminForm.get('telp').value,
                    fileName: this.adminForm.get('fileName').value,
                    imageUrl: url
                  }

                  this.adminService.update(this.key, data)
                    .catch(error => {
                      Swal.showValidationMessage(
                        `Request failed: ${error}`
                      )
                    });
                })
              })
            ).subscribe()
            return uploadTask.percentageChanges();
          } else {
            const data = {
              nama: this.adminForm.get('nama').value,
              telp: this.adminForm.get('telp').value,
            }

            return this.adminService.update(this.key, data)
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
}
