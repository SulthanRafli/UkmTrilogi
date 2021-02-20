import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PendaftaranService } from 'src/app/services/firebase/pendaftaran.service';
import * as moment from 'moment';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subject } from 'rxjs';
import { Ukm } from '../models/ukm.model';
import { UkmService } from '../services/firebase/ukm.service';
import { KriteriaService } from '../services/firebase/kriteria.service';
import { JawabanKriteriaService } from '../services/firebase/jawaban-kriteria.service';

@Component({
  selector: 'app-form-pendaftaran',
  templateUrl: './form-pendaftaran.component.html',
  styleUrls: ['./form-pendaftaran.component.scss']
})
export class FormPendaftaranComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();
  public pendaftaranForm: FormGroup;
  public isFormEmpty: boolean;
  public filePhoto: File;
  public fileDokumen: File;
  public loading: boolean;
  public key: string;
  public ukm: Ukm;
  public photoPreview: any;
  private countItem: number = 1;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild('photo') photo: ElementRef;
  @ViewChild('dokumen') dokumen: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public pendaftaranService: PendaftaranService,
    public kriteriaService: KriteriaService,
    public jawabanKriteriaService: JawabanKriteriaService,
    public ukmService: UkmService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getNomorPendaftaran();
    this.getUkm();
    this.getAllKriteria();
  }

  getNomorPendaftaran(): void {
    this.loading = true;
    this.pendaftaranService.getAll(this.key).pipe(
    ).subscribe(
      (data) => {
        this.pendaftaranForm.get('nomorPendaftaran').setValue(`${new Date().getTime()}${data.length + 1}`)
        this.loading = false;
      },
      (error) => {
        console.log(error);
      },
    );
  }

  getUkm(): void {
    this.ukmService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
      })
    ).subscribe(
      (data) => {
        this.ukm = data;
      },
      (error) => { },
    );
  }

  formValidation(): void {
    this.pendaftaranForm = this.formBuilder.group({
      nomorPendaftaran: new FormControl({ value: null, disabled: true }, [Validators.required]),
      nama: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      jenisKelamin: new FormControl("Laki - laki", [Validators.required]),
      telp: new FormControl(null, [Validators.required, Validators.pattern('^(^\\+62\\s?|^0)(\\d{3,4}?){2}\\d{3,4}$')]),
      tempatLahir: new FormControl(null, [Validators.required]),
      tanggalLahir: new FormControl(null, [Validators.required]),
      jurusan: new FormControl(null, [Validators.required]),
      fakultas: new FormControl("Ekonomi", [Validators.required]),
      alamat: new FormControl(null, [Validators.required]),
      fileName: new FormControl(null, [Validators.required]),
      fileNameDokumen: new FormControl(null, [Validators.required]),
      hobi: new FormControl(null, [Validators.required]),
      bakat: new FormControl(null, [Validators.required]),
      alasan: new FormControl(null, [Validators.required]),
      tanya: new FormControl(null, [Validators.required]),
      items: new FormArray([])
    });

    this.t.push(this.formBuilder.group({
      kriteria: ['', [Validators.required]],
      jawaban: [''],
    }));

    this.pendaftaranForm.get('items');
  }

  get f() { return this.pendaftaranForm.controls; }
  get t() { return this.f.items as FormArray; }

  getAllKriteria(): void {
    this.loading = true;
    this.kriteriaService.getAll(this.key).pipe(
    ).subscribe(
      (data) => {
        if (data !== undefined) {
          this.countItem = data.length;
          this.t.clear();
          for (let i = 0; i < data.length; i++) {
            this.t.push(this.formBuilder.group({
              kriteria: [data[i].payload.doc.data()['kriteria'], [Validators.required]],
              jawaban: [''],
            }));
          }
        }
        this.loading = false;
      },
      (error) => {
      },
    );
  }

  getPhoto() {
    if (this.photo == null) {
      return;
    }
    this.photo.nativeElement.click();
  }

  getDokumen() {
    if (this.dokumen == null) {
      return;
    }
    this.dokumen.nativeElement.click();
  }

  uploadPhoto() {
    if (this.photo == null) {
      return;
    }
    const fileList: any = this.photo.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.pendaftaranForm.get('fileName').setValue(fileList[0].name);
      this.filePhoto = fileList[0];
      this.firstFileToBase64(fileList[0]).then((result: string) => {
        this.photoPreview = result;
      }, (err: any) => {
        this.photoPreview = null;
      });
    }
  }

  uploadDokumen() {
    if (this.dokumen == null) {
      return;
    }
    const fileList: any = this.dokumen.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.pendaftaranForm.get('fileNameDokumen').setValue(fileList[0].name);
      this.fileDokumen = fileList[0];
    }
  }

  firstFileToBase64(fileImage: any): Promise<{}> {
    return new Promise((resolve, reject) => {
      let fileReader: FileReader = new FileReader();
      if (fileReader && fileImage != null) {
        fileReader.readAsDataURL(fileImage);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject(new Error('No file found'));
      }
    });
  }

  back(): void {
    this.location.back();
  }

  redirectToPengumuman() {
    this.router.navigate(['pengumuman/detail-pengumuman/' + this.key]);
  }

  async save(): Promise<void> {
    if (!this.pendaftaranForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;
    }

    const date = Date.now()
    const typeData = this.pendaftaranForm.get('fileName').value.substr(this.pendaftaranForm.get('fileName').value.lastIndexOf(".") + 1);
    const newFileName = `PendaftaranProfile-${date}.${typeData}`;
    const filePath = `Pendaftaran/${newFileName}`;
    const fileRef = this.angularFirestorage.ref(filePath);
    const uploadTask = this.angularFirestorage.upload(filePath, this.filePhoto);

    const dateDokumen = Date.now()
    const typeDataDokumen = this.pendaftaranForm.get('fileNameDokumen').value.substr(this.pendaftaranForm.get('fileNameDokumen').value.lastIndexOf(".") + 1);
    const newFileNameDokumen = `PendaftaranDokumen-${dateDokumen}.${typeDataDokumen}`;
    const filePathDokumen = `Pendaftaran/${newFileNameDokumen}`;
    const fileRefDokumen = this.angularFirestorage.ref(filePathDokumen);
    const uploadTaskDokumen = this.angularFirestorage.upload(filePathDokumen, this.fileDokumen);

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
              uploadTaskDokumen.snapshotChanges().pipe(
                finalize(() => {
                  fileRefDokumen.getDownloadURL().subscribe(urlDokumen => {
                    const data = {
                      idUkm: this.key,
                      namaUkm: this.ukm.nama,
                      nomorPendaftaran: this.pendaftaranForm.get('nomorPendaftaran').value,
                      nama: this.pendaftaranForm.get('nama').value,
                      email: this.pendaftaranForm.get('email').value,
                      jenisKelamin: this.pendaftaranForm.get('jenisKelamin').value,
                      telp: this.pendaftaranForm.get('telp').value,
                      tempatLahir: this.pendaftaranForm.get('tempatLahir').value,
                      tanggalLahir: moment(this.pendaftaranForm.get('tanggalLahir').value).format('YYYY-MM-DD'),
                      jurusan: this.pendaftaranForm.get('jurusan').value,
                      fakultas: this.pendaftaranForm.get('fakultas').value,
                      alamat: this.pendaftaranForm.get('alamat').value,
                      fileName: this.pendaftaranForm.get('fileName').value,
                      imageUrl: url,
                      fileNameDokumen: this.pendaftaranForm.get('fileNameDokumen').value,
                      imageDokumenUrl: urlDokumen,
                      hobi: this.pendaftaranForm.get('hobi').value,
                      bakat: this.pendaftaranForm.get('bakat').value,
                      alasan: this.pendaftaranForm.get('alasan').value,
                      tanya: this.pendaftaranForm.get('tanya').value,
                      status: 'pending',
                      tanggalDaftar: moment().format('YYYY-MM-DD'),
                      dateMake: new Date().getTime()
                    }

                    this.pendaftaranService.create(data)
                      .catch(error => {
                        Swal.showValidationMessage(
                          `Request failed: ${error}`
                        )
                      });

                    let tempKriteria = [];

                    for (let i = 0; i < this.countItem; i++) {
                      let dataForm = (<FormArray>this.pendaftaranForm.controls['items']).at(i);

                      let tempData = {
                        idUkm: this.key,
                        nomorPendaftaran: this.pendaftaranForm.get('nomorPendaftaran').value,
                        kriteria: dataForm.get('kriteria').value,
                        jawaban: dataForm.get('jawaban').value,
                        dateMake: new Date().getTime()
                      }

                      tempKriteria.push(tempData);
                    }

                    tempKriteria.map(val => {
                      this.jawabanKriteriaService.create(val)
                        .catch(error => {
                          Swal.showValidationMessage(
                            `Request failed: ${error}`
                          )
                        });
                    })
                  })
                })
              ).subscribe()
              return uploadTaskDokumen.percentageChanges();
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
          title: 'Pendaftaran Berhasil',
          text: `
          Anda telah terdaftar dengan no ${this.pendaftaranForm.get('nomorPendaftaran').value} harap disimpan untuk 
          pendaftaran tersebut untuk mengecek pengumuman hasil, anda akan diarahkan ke halaman hasil pengumuman`,
          confirmButtonColor: '#07cdae',
        }).then((result) => {
          if (result.value) {
            this.redirectToPengumuman();
          }
        });
      }
    })
  }
}
