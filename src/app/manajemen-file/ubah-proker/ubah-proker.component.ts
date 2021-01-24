import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProkerService } from 'src/app/services/firebase/proker.service';
import * as moment from 'moment';
import { Proker } from 'src/app/models/proker.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubah-proker',
  templateUrl: './ubah-proker.component.html',
  styleUrls: ['./ubah-proker.component.scss']
})
export class UbahProkerComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public prokerForm: FormGroup;
  public isFormEmpty: boolean;
  public fileProker: File;

  public key: string;

  public proker: Proker;
  public loading: boolean;

  @ViewChild('file') file: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public prokerService: ProkerService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getProker();
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

  getProker(): void {
    this.loading = true;
    this.prokerService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.proker = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.prokerForm.get('nama').setValue(this.proker.nama);
    this.prokerForm.get('namaDivisi').setValue(this.proker.namaDivisi);
    this.prokerForm.get('tanggal').setValue(this.proker.tanggal);
    this.prokerForm.get('deskripsi').setValue(this.proker.deskripsi);
    this.prokerForm.get('fileName').setValue(this.proker.fileName);
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
        if (this.fileProker !== undefined) {
          uploadTask.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {

                const data = {
                  nama: this.prokerForm.get('nama').value,
                  namaDivisi: this.prokerForm.get('namaDivisi').value,
                  tanggal: moment(this.prokerForm.get('tanggal').value).format('YYYY-MM-DD'),
                  deskripsi: this.prokerForm.get('deskripsi').value,
                  fileName: this.prokerForm.get('fileName').value,
                  fileUrl: url,
                }

                this.prokerService.update(this.key, data)
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
            nama: this.prokerForm.get('nama').value,
            namaDivisi: this.prokerForm.get('namaDivisi').value,
            tanggal: moment(this.prokerForm.get('tanggal').value).format('YYYY-MM-DD'),
            deskripsi: this.prokerForm.get('deskripsi').value,
          }

          return this.prokerService.update(this.key, data)
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
