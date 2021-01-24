import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LpjService } from 'src/app/services/firebase/lpj.service';
import * as moment from 'moment';
import { Lpj } from 'src/app/models/lpj.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubah-lpj',
  templateUrl: './ubah-lpj.component.html',
  styleUrls: ['./ubah-lpj.component.scss']
})
export class UbahLpjComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public lpjForm: FormGroup;
  public isFormEmpty: boolean;
  public fileLpj: File;

  public key: string;

  public lpj: Lpj;
  public loading: boolean;

  @ViewChild('file') file: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public lpjService: LpjService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getLpj();
  }

  formValidation(): void {
    this.lpjForm = this.formBuilder.group({
      judul: new FormControl(null, [Validators.required]),
      namaDivisi: new FormControl(null, [Validators.required]),
      tanggalPeriode: new FormControl(null, [Validators.required]),
      fileName: new FormControl(null, [Validators.required]),
    });
  }

  getLpj(): void {
    this.loading = true;
    this.lpjService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.lpj = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.lpjForm.get('judul').setValue(this.lpj.judul);
    this.lpjForm.get('namaDivisi').setValue(this.lpj.namaDivisi);
    this.lpjForm.get('tanggalPeriode').setValue(this.lpj.tanggalPeriode);
    this.lpjForm.get('fileName').setValue(this.lpj.fileName);
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
    }

    const date = Date.now()
    const typeData = this.lpjForm.get('fileName').value.substr(this.lpjForm.get('fileName').value.lastIndexOf(".") + 1);
    const newFileName = `Lpj-${date}.${typeData}`;
    const filePath = `Lpj/${newFileName}`;
    const fileRef = this.angularFirestorage.ref(filePath);
    const uploadTask = this.angularFirestorage.upload(filePath, this.fileLpj);

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
        if (this.fileLpj !== undefined) {
          uploadTask.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {
                const data = {
                  judul: this.lpjForm.get('judul').value,
                  namaDivisi: this.lpjForm.get('namaDivisi').value,
                  tanggalPeriode: moment(this.lpjForm.get('tanggalPeriode').value).format('YYYY-MM-DD'),
                  fileName: this.lpjForm.get('fileName').value,
                  fileUrl: url,
                }

                this.lpjService.update(this.key, data)
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
            judul: this.lpjForm.get('judul').value,
            namaDivisi: this.lpjForm.get('namaDivisi').value,
            tanggalPeriode: moment(this.lpjForm.get('tanggalPeriode').value).format('YYYY-MM-DD'),
          }

          return this.lpjService.update(this.key, data)
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
