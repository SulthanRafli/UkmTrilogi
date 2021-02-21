import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BeritaService } from 'src/app/services/firebase/berita.service';
import { Ukm } from 'src/app/models/ukm.model';
import * as moment from 'moment';

@Component({
  selector: 'app-add-berita',
  templateUrl: './add-berita.component.html',
  styleUrls: ['./add-berita.component.scss']
})
export class AddBeritaComponent implements OnInit {

  public beritaForm: FormGroup;
  public isFormEmpty: boolean;
  public filePhoto: File;
  public ukm: Ukm;

  @ViewChild('photo') photo: ElementRef;

  constructor(
    public beritaService: BeritaService,
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
    this.beritaForm = this.formBuilder.group({
      judul: new FormControl(null, [Validators.required]),
      kategoriUkm: new FormControl({ value: this.ukm.nama, disabled: true }, [Validators.required]),
      isiBerita: new FormControl(null, [Validators.required]),
      namaPenulis: new FormControl(null, [Validators.required]),
      tanggalUpload: new FormControl({ value: moment().format("YYYY-MM-DD"), disabled: true }, [Validators.required]),
      fileName: new FormControl(null, [Validators.required]),
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
      this.beritaForm.get('fileName').setValue(fileList[0].name);
      this.filePhoto = fileList[0];
    }
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigate(['berita/manage-berita']);
  }

  async save(): Promise<void> {
    if (!this.beritaForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;


      const date = Date.now()
      const typeData = this.beritaForm.get('fileName').value.substr(this.beritaForm.get('fileName').value.lastIndexOf(".") + 1);
      const newFileName = `Berita-${date}.${typeData}`;
      const filePath = `Berita/${newFileName}`;
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
                  judul: this.beritaForm.get('judul').value,
                  isiBerita: this.beritaForm.get('isiBerita').value,
                  namaPenulis: this.beritaForm.get('namaPenulis').value,
                  tanggalUpload: moment(this.beritaForm.get('tanggalUpload').value).format('YYYY-MM-DD'),
                  fileName: this.beritaForm.get('fileName').value,
                  imageUrl: url,
                  dateMake: new Date().getTime()
                }

                this.beritaService.create(data)
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
