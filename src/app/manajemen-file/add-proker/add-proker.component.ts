import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProkerService } from 'src/app/services/firebase/proker.service';
import { Ukm } from 'src/app/models/ukm.model';
import * as moment from 'moment';

@Component({
  selector: 'app-add-proker',
  templateUrl: './add-proker.component.html',
  styleUrls: ['./add-proker.component.scss']
})
export class AddProkerComponent implements OnInit {

  public prokerForm: FormGroup;
  public isFormEmpty: boolean;
  public fileProker: File;
  public ukm: Ukm;

  @ViewChild('file') file: ElementRef;

  constructor(
    public prokerService: ProkerService,
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
    this.prokerForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      namaDivisi: new FormControl(null, [Validators.required]),
      tanggal: new FormControl(null, [Validators.required]),
      deskripsi: new FormControl(null, [Validators.required]),
      fileName: new FormControl(null, [Validators.required]),
    });
  }

  getFile() {
    if (this.file == null) {
      return;
    }
    this.file.nativeElement.click();
  }

  uploadFile() {
    if (this.file == null) {
      return;
    }
    const fileList: any = this.file.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.prokerForm.get('fileName').setValue(fileList[0].name);
      this.fileProker = fileList[0];
    }
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigate(['manajemen-file/manage-proker']);
  }

  async save(): Promise<void> {
    if (!this.prokerForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;
    }

    const date = Date.now()
    const typeData = this.prokerForm.get('fileName').value.substr(this.prokerForm.get('fileName').value.lastIndexOf(".") + 1);
    const newFileName = `Proker-${date}.${typeData}`;
    const filePath = `Proker/${newFileName}`;
    const fileRef = this.angularFirestorage.ref(filePath);
    const uploadTask = this.angularFirestorage.upload(filePath, this.fileProker);

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
                nama: this.prokerForm.get('nama').value,
                namaDivisi: this.prokerForm.get('namaDivisi').value,
                tanggal: moment(this.prokerForm.get('tanggal').value).format('YYYY-MM-DD'),
                deskripsi: this.prokerForm.get('deskripsi').value,
                fileName: this.prokerForm.get('fileName').value,
                fileUrl: url,
                dateMake: new Date().getTime()
              }

              this.prokerService.create(data)
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
