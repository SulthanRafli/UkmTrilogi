import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { KegiatanService } from 'src/app/services/firebase/kegiatan.service';
import Swal from 'sweetalert2'
import { Ukm } from 'src/app/models/ukm.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { LpjService } from 'src/app/services/firebase/lpj.service';

@Component({
  selector: 'app-add-kegiatan',
  templateUrl: './add-kegiatan.component.html',
  styleUrls: ['./add-kegiatan.component.scss']
})
export class AddKegiatanComponent implements OnInit {

  public kegiatanForm: FormGroup;
  public isFormEmpty: boolean;
  public fileLpj: File;
  public ukm: Ukm;

  @ViewChild('file') file: ElementRef;

  constructor(
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public kegiatanService: KegiatanService,
    public lpjService: LpjService,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ukm = JSON.parse(localStorage.getItem('ukm'));
    this.formValidation();
  }

  formValidation(): void {
    this.kegiatanForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      tanggal: new FormControl(null, [Validators.required]),
      jamMulai: new FormControl(null, [Validators.required]),
      jamSelesai: new FormControl(null, [Validators.required]),
      deskripsi: new FormControl(null, [Validators.required]),
      namaDivisi: new FormControl(null, [Validators.required]),
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
      this.kegiatanForm.get('fileName').setValue(fileList[0].name);
      this.fileLpj = fileList[0];
    }
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigateByUrl('kegiatan/manage-kegiatan');
  }

  async save(): Promise<void> {
    if (!this.kegiatanForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;

      const data = {
        idUkm: this.ukm.id,
        namaUkm: this.ukm.nama,
        nama: this.kegiatanForm.get('nama').value,
        tanggal: moment(this.kegiatanForm.get('tanggal').value).format('YYYY-MM-DD'),
        jamMulai: this.kegiatanForm.get('jamMulai').value,
        jamSelesai: this.kegiatanForm.get('jamSelesai').value,
        deskripsi: this.kegiatanForm.get('deskripsi').value,
        dateMake: new Date().getTime()
      }

      const date = Date.now()
      const typeData = this.kegiatanForm.get('fileName').value.substr(this.kegiatanForm.get('fileName').value.lastIndexOf(".") + 1);
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

                const dataLpj = {
                  idUkm: this.ukm.id,
                  namaUkm: this.ukm.nama,
                  judul: this.kegiatanForm.get('nama').value,
                  namaDivisi: this.kegiatanForm.get('namaDivisi').value,
                  tanggalPeriode: moment(this.kegiatanForm.get('tanggal').value).format('YYYY-MM-DD'),
                  fileName: this.kegiatanForm.get('fileName').value,
                  fileUrl: url,
                  dateMake: new Date().getTime()
                }
  
                this.lpjService.create(dataLpj)
                  .catch(error => {
                    Swal.showValidationMessage(
                      `Request failed: ${error}`
                    )
                  });

                this.kegiatanService.create(data)
                  .catch(error => {
                    Swal.showValidationMessage(
                      `Request failed: ${error}`
                    )
                  })
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
