import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LpjService } from 'src/app/services/firebase/lpj.service';
import { Ukm } from 'src/app/models/ukm.model';
import * as moment from 'moment';

@Component({
  selector: 'app-add-lpj',
  templateUrl: './add-lpj.component.html',
  styleUrls: ['./add-lpj.component.scss']
})
export class AddLpjComponent implements OnInit {

  public lpjForm: FormGroup;
  public isFormEmpty: boolean;
  public fileLpj: File;
  public ukm: Ukm;

  @ViewChild('file') file: ElementRef;

  constructor(
    public lpjService: LpjService,
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
    this.lpjForm = this.formBuilder.group({
      judul: new FormControl(null, [Validators.required]),
      namaDivisi: new FormControl(null, [Validators.required]),
      tanggalPeriode: new FormControl(null, [Validators.required]),
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
      this.lpjForm.get('fileName').setValue(fileList[0].name);
      this.fileLpj = fileList[0];
    }
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigate(['manajemen-file/manage-lpj']);
  }

  async save(): Promise<void> {
    if (!this.lpjForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;

      const date = Date.now()
      const typeData = this.lpjForm.get('fileName').value.substr(this.lpjForm.get('fileName').value.lastIndexOf(".") + 1);
      const newFileName = `Lpj-${date}.${typeData}`;
      const filePath = `Lpj/${newFileName}`;
      const fileRef = this.angularFirestorage.ref(filePath);
      const uploadTask = this.angularFirestorage.upload(filePath, this.fileLpj);

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
                  judul: this.lpjForm.get('judul').value,
                  namaDivisi: this.lpjForm.get('namaDivisi').value,
                  tanggalPeriode: moment(this.lpjForm.get('tanggalPeriode').value).format('YYYY-MM-DD'),
                  fileName: this.lpjForm.get('fileName').value,
                  fileUrl: url,
                  dateMake: new Date().getTime()
                }

                this.lpjService.create(data)
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
}
