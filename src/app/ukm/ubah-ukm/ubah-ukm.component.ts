import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UkmService } from 'src/app/services/firebase/ukm.service';
import { KriteriaService } from 'src/app/services/firebase/kriteria.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { Ukm } from 'src/app/models/ukm.model';
import { Kriteria } from 'src/app/models/kriteria.model';

@Component({
  selector: 'app-ubah-ukm',
  templateUrl: './ubah-ukm.component.html',
  styleUrls: ['./ubah-ukm.component.scss']
})
export class UbahUkmComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public ukmForm: FormGroup;
  public isFormEmpty: boolean;
  public fileLogoPhoto: File;
  public fileStrukturPhoto: File;
  public key: string;
  private countItem: number = 1;

  public ukm: Ukm;
  public kriteria: Kriteria[];
  public loading: boolean;

  @ViewChild('photoLogo') photoLogo: ElementRef;
  @ViewChild('photoStruktur') photoStruktur: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public ukmService: UkmService,
    public kriteriaService: KriteriaService,
    public angularFirestorage: AngularFireStorage,
    public angularFireAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getUkm();
    this.getAllKriteria();
  }

  getUkm(): void {
    this.loading = true;
    this.ukmService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe(
      (data) => {
        this.ukm = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.ukmForm.get('nama').setValue(this.ukm.nama);
    this.ukmForm.get('deskripsi').setValue(this.ukm.deskripsi);
    this.ukmForm.get('telp').setValue(this.ukm.telp);
    this.ukmForm.get('alamat').setValue(this.ukm.alamat);
    this.ukmForm.get('fileLogoName').setValue(this.ukm.fileLogoName);
    this.ukmForm.get('fileStrukturName').setValue(this.ukm.fileStrukturName);
    this.ukmForm.get('email').setValue(this.ukm.email);
    this.ukmForm.get('password').setValue(this.ukm.password);
    this.ukmForm.get('alamat').setValue(this.ukm.alamat);
  }

  formValidation(): void {
    this.ukmForm = this.formBuilder.group({
      nama: new FormControl(null, [Validators.required]),
      deskripsi: new FormControl(null, [Validators.required]),
      telp: new FormControl(null, [Validators.required, Validators.pattern('^(^\\+62\\s?|^0)(\\d{3,4}?){2}\\d{3,4}$')]),
      alamat: new FormControl(null, [Validators.required]),
      fileLogoName: new FormControl(null, [Validators.required]),
      fileStrukturName: new FormControl(null, [Validators.required]),
      email: new FormControl({ value: null, disabled: true }),
      password: new FormControl({ value: null, disabled: true }),
      items: new FormArray([])
    });

    this.t.push(this.formBuilder.group({
      kriteria: ['', [Validators.required]],
    }));

    this.ukmForm.get('items');
  }

  get f() { return this.ukmForm.controls; }
  get t() { return this.f.items as FormArray; }

  addControl() {
    this.countItem++;

    if (this.t.length < this.countItem) {
      for (let i = this.t.length; i < this.countItem; i++) {
        this.t.push(this.formBuilder.group({
          kriteria: ['', Validators.required],
        }));
      }
    }
  }

  removeControl(index: number): void {
    this.countItem--;
    this.t.removeAt(index);
  }

  getPhotoLogo() {
    if (this.photoLogo == null) {
      return;
    }
    this.photoLogo.nativeElement.click();
  }

  uploadPhotoLogo() {
    if (this.photoLogo == null) {
      return;
    }
    const fileList: any = this.photoLogo.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.ukmForm.get('fileLogoName').setValue(fileList[0].name);
      this.fileLogoPhoto = fileList[0];
    }
  }

  getPhotoStruktur() {
    if (this.photoStruktur == null) {
      return;
    }
    this.photoStruktur.nativeElement.click();
  }

  uploadPhotoStruktur() {
    if (this.photoStruktur == null) {
      return;
    }
    const fileList: any = this.photoStruktur.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.ukmForm.get('fileStrukturName').setValue(fileList[0].name);
      this.fileStrukturPhoto = fileList[0];
    }
  }

  back(): void {
    this.location.back();
  }

  redirectToManage() {
    this.router.navigateByUrl('ukm/manage-ukm');
  }

  getAllKriteria(): void {
    this.loading = true;
    this.kriteriaService.getAll(this.key).pipe(
    ).subscribe(
      (data) => {
        this.kriteria = data.map(e => {
          return {
            id: e.payload.doc.id,
            idUkm: e.payload.doc.data()['idUkm'],
            kriteria: e.payload.doc.data()['kriteria'],
            dateMake: e.payload.doc.data()['dateMake'],
          }
        });
        if (data !== undefined) {
          this.countItem = data.length;
          this.t.clear();
          for (let i = 0; i < data.length; i++) {
            this.t.push(this.formBuilder.group({
              kriteria: [data[i].payload.doc.data()['kriteria'], [Validators.required]],
            }));
          }
        }
        this.loading = false;
      },
      (error) => {
      },
    );
  }

  async save(): Promise<void> {
    if (!this.ukmForm.valid) {
      this.isFormEmpty = true;
    } else {
      this.isFormEmpty = false;
    }

    const dateLogo = Date.now()
    const typeDataLogo = this.ukmForm.get('fileLogoName').value.substr(this.ukmForm.get('fileLogoName').value.lastIndexOf(".") + 1);
    const newFileNameLogo = `UkmLogo-${dateLogo}.${typeDataLogo}`;
    const filePathLogo = `Ukm/${newFileNameLogo}`;
    const fileRefLogo = this.angularFirestorage.ref(filePathLogo);
    const uploadTaskLogo = this.angularFirestorage.upload(filePathLogo, this.fileLogoPhoto);

    const dateStruktur = Date.now()
    const typeDataStruktur = this.ukmForm.get('fileStrukturName').value.substr(this.ukmForm.get('fileStrukturName').value.lastIndexOf(".") + 1);
    const newFileNameStruktur = `UkmStruktur-${dateStruktur}.${typeDataStruktur}`;
    const filePathStruktur = `Ukm/${newFileNameStruktur}`;
    const fileRefStruktur = this.angularFirestorage.ref(filePathStruktur);
    const uploadTaskStruktur = this.angularFirestorage.upload(filePathStruktur, this.fileStrukturPhoto);

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
        if (this.fileLogoPhoto !== undefined && this.fileStrukturPhoto !== undefined) {
          uploadTaskLogo.snapshotChanges().pipe(
            finalize(() => {
              fileRefLogo.getDownloadURL().subscribe(urlLogo => {
                uploadTaskStruktur.snapshotChanges().pipe(
                  finalize(() => {
                    fileRefStruktur.getDownloadURL().subscribe(urlStruktur => {

                      const data = {
                        nama: this.ukmForm.get('nama').value,
                        deskripsi: this.ukmForm.get('deskripsi').value,
                        telp: this.ukmForm.get('telp').value,
                        alamat: this.ukmForm.get('alamat').value,
                        fileLogoName: this.ukmForm.get('fileLogoName').value,
                        fileStrukturName: this.ukmForm.get('fileStrukturName').value,
                        imageLogoUrl: urlLogo,
                        imageStrukturUrl: urlStruktur,
                      }

                      this.ukmService.update(this.key, data)
                        .catch(error => {
                          Swal.showValidationMessage(
                            `Request failed: ${error}`
                          )
                        });

                      if (this.kriteria.length !== 0) {
                        this.kriteria.map(val => {
                          this.kriteriaService.delete(val.id);
                        })

                        let tempKriteria = [];

                        for (let i = 0; i < this.countItem; i++) {
                          let dataForm = (<FormArray>this.ukmForm.controls['items']).at(i);

                          let tempData = {
                            idUkm: this.key,
                            kriteria: dataForm.get('kriteria').value,
                            dateMake: new Date().getTime()
                          }

                          tempKriteria.push(tempData);
                        }

                        tempKriteria.map(val => {
                          this.kriteriaService.create(val)
                            .catch(error => {
                              Swal.showValidationMessage(
                                `Request failed: ${error}`
                              )
                            });
                        })
                      }
                    })
                  })
                ).subscribe()
                return uploadTaskStruktur.percentageChanges();
              })
            })
          ).subscribe()
          return uploadTaskLogo.percentageChanges();
        } else if (this.fileLogoPhoto !== undefined && this.fileStrukturPhoto === undefined) {
          uploadTaskLogo.snapshotChanges().pipe(
            finalize(() => {
              fileRefLogo.getDownloadURL().subscribe(urlLogo => {
                const data = {
                  nama: this.ukmForm.get('nama').value,
                  deskripsi: this.ukmForm.get('deskripsi').value,
                  telp: this.ukmForm.get('telp').value,
                  alamat: this.ukmForm.get('alamat').value,
                  fileLogoName: this.ukmForm.get('fileLogoName').value,
                  imageLogoUrl: urlLogo,
                }

                this.ukmService.update(this.key, data)
                  .catch(error => {
                    Swal.showValidationMessage(
                      `Request failed: ${error}`
                    )
                  });

                if (this.kriteria.length !== 0) {
                  this.kriteria.map(val => {
                    this.kriteriaService.delete(val.id);
                  })

                  let tempKriteria = [];

                  for (let i = 0; i < this.countItem; i++) {
                    let dataForm = (<FormArray>this.ukmForm.controls['items']).at(i);

                    let tempData = {
                      idUkm: this.key,
                      kriteria: dataForm.get('kriteria').value,
                      dateMake: new Date().getTime()
                    }

                    tempKriteria.push(tempData);
                  }

                  tempKriteria.map(val => {
                    this.kriteriaService.create(val)
                      .catch(error => {
                        Swal.showValidationMessage(
                          `Request failed: ${error}`
                        )
                      });
                  })
                }
              })
            })
          ).subscribe()
          return uploadTaskLogo.percentageChanges();
        } else if (this.fileLogoPhoto === undefined && this.fileStrukturPhoto !== undefined) {
          uploadTaskStruktur.snapshotChanges().pipe(
            finalize(() => {
              fileRefStruktur.getDownloadURL().subscribe(urlStruktur => {
                const data = {
                  nama: this.ukmForm.get('nama').value,
                  deskripsi: this.ukmForm.get('deskripsi').value,
                  telp: this.ukmForm.get('telp').value,
                  alamat: this.ukmForm.get('alamat').value,
                  fileStrukturName: this.ukmForm.get('fileStrukturName').value,
                  imageStrukturUrl: urlStruktur,
                }

                this.ukmService.update(this.key, data)
                  .catch(error => {
                    Swal.showValidationMessage(
                      `Request failed: ${error}`
                    )
                  });

                if (this.kriteria.length !== 0) {
                  this.kriteria.map(val => {
                    this.kriteriaService.delete(val.id);
                  })

                  let tempKriteria = [];

                  for (let i = 0; i < this.countItem; i++) {
                    let dataForm = (<FormArray>this.ukmForm.controls['items']).at(i);

                    let tempData = {
                      idUkm: this.key,
                      kriteria: dataForm.get('kriteria').value,
                      dateMake: new Date().getTime()
                    }

                    tempKriteria.push(tempData);
                  }

                  tempKriteria.map(val => {
                    this.kriteriaService.create(val)
                      .catch(error => {
                        Swal.showValidationMessage(
                          `Request failed: ${error}`
                        )
                      });
                  })
                }
              })
            })
          ).subscribe()
          return uploadTaskStruktur.percentageChanges();
        } else {
          const data = {
            nama: this.ukmForm.get('nama').value,
            deskripsi: this.ukmForm.get('deskripsi').value,
            telp: this.ukmForm.get('telp').value,
            alamat: this.ukmForm.get('alamat').value,
          }

          if (this.kriteria.length !== 0) {
            this.kriteria.map(val => {
              this.kriteriaService.delete(val.id);
            })

            let tempKriteria = [];

            for (let i = 0; i < this.countItem; i++) {
              let dataForm = (<FormArray>this.ukmForm.controls['items']).at(i);

              let tempData = {
                idUkm: this.key,
                kriteria: dataForm.get('kriteria').value,
                dateMake: new Date().getTime()
              }

              tempKriteria.push(tempData);
            }

            tempKriteria.map(val => {
              this.kriteriaService.create(val)
                .catch(error => {
                  Swal.showValidationMessage(
                    `Request failed: ${error}`
                  )
                });
            })
          }

          return this.ukmService.update(this.key, data)
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
