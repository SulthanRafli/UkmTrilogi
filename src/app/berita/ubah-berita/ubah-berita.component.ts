import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BeritaService } from 'src/app/services/firebase/berita.service';
import { Berita } from 'src/app/models/berita.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubah-berita',
  templateUrl: './ubah-berita.component.html',
  styleUrls: ['./ubah-berita.component.scss']
})
export class UbahBeritaComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public beritaForm: FormGroup;
  public isFormEmpty: boolean;
  public filePhoto: File;

  public key: string;

  public berita: Berita;
  public loading: boolean;

  @ViewChild('photo') photo: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public beritaService: BeritaService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getBerita();
  }

  formValidation(): void {
    this.beritaForm = this.formBuilder.group({
      judul: new FormControl(null, [Validators.required]),
      kategoriUkm: new FormControl({ value: null, disabled: true }, [Validators.required]),
      isiBerita: new FormControl(null, [Validators.required]),
      namaPenulis: new FormControl(null, [Validators.required]),
      tanggalUpload: new FormControl({ value: null, disabled: true }, [Validators.required]),
      fileName: new FormControl(null, [Validators.required]),
    });
  }

  getBerita(): void {
    this.loading = true;
    this.beritaService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.berita = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.beritaForm.get('judul').setValue(this.berita.judul);
    this.beritaForm.get('kategoriUkm').setValue(this.berita.namaUkm);
    this.beritaForm.get('isiBerita').setValue(this.berita.isiBerita);
    this.beritaForm.get('namaPenulis').setValue(this.berita.namaPenulis);
    this.beritaForm.get('tanggalUpload').setValue(this.berita.tanggalUpload);
    this.beritaForm.get('fileName').setValue(this.berita.fileName);
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
    }

    const date = Date.now()
    const typeData = this.beritaForm.get('fileName').value.substr(this.beritaForm.get('fileName').value.lastIndexOf(".") + 1);
    const newFileName = `Berita-${date}.${typeData}`;
    const filePath = `Berita/${newFileName}`;
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
                  judul: this.beritaForm.get('judul').value,
                  isiBerita: this.beritaForm.get('isiBerita').value,
                  namaPenulis: this.beritaForm.get('namaPenulis').value,
                  fileName: this.beritaForm.get('fileName').value,
                  imageUrl: url
                }

                this.beritaService.update(this.key, data)
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
            judul: this.beritaForm.get('judul').value,
            isiBerita: this.beritaForm.get('isiBerita').value,
            namaPenulis: this.beritaForm.get('namaPenulis').value,
          }

          return this.beritaService.update(this.key, data)
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
