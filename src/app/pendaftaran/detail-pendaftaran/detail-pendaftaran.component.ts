import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PendaftaranService } from 'src/app/services/firebase/pendaftaran.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subject } from 'rxjs';
import { Pendaftaran } from 'src/app/models/pendaftaran.model';

@Component({
  selector: 'app-detail-pendaftaran',
  templateUrl: './detail-pendaftaran.component.html',
  styleUrls: ['./detail-pendaftaran.component.scss']
})
export class DetailPendaftaranComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();
  public pendaftaranForm: FormGroup;
  public isFormEmpty: boolean;
  public filePhoto: File;
  public loading: boolean;
  public key: string;
  public pendaftaran: Pendaftaran;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild('photo') photo: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public pendaftaranService: PendaftaranService,
    public angularFirestorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.formValidation();
    this.getPendaftaran();
  }

  getPendaftaran(): void {
    this.loading = true;
    this.pendaftaranService.findByKey(this.key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(
      (data) => {
        this.pendaftaran = data;
        this.fillData();
      },
      (error) => { },
    );
  }

  fillData(): void {
    this.pendaftaranForm.get('nomorPendaftaran').setValue(this.pendaftaran.nomorPendaftaran);
    this.pendaftaranForm.get('nama').setValue(this.pendaftaran.nama);
    this.pendaftaranForm.get('email').setValue(this.pendaftaran.email);
    this.pendaftaranForm.get('jenisKelamin').setValue(this.pendaftaran.jenisKelamin);
    this.pendaftaranForm.get('telp').setValue(this.pendaftaran.telp);
    this.pendaftaranForm.get('tempatLahir').setValue(this.pendaftaran.tempatLahir);
    this.pendaftaranForm.get('tanggalLahir').setValue(this.pendaftaran.tanggalLahir);
    this.pendaftaranForm.get('jurusan').setValue(this.pendaftaran.jurusan);
    this.pendaftaranForm.get('fakultas').setValue(this.pendaftaran.fakultas);
    this.pendaftaranForm.get('alamat').setValue(this.pendaftaran.alamat);
    this.pendaftaranForm.get('fileName').setValue(this.pendaftaran.fileName);
    this.pendaftaranForm.get('fileNameDokumen').setValue(this.pendaftaran.fileNameDokumen);
    this.pendaftaranForm.get('hobi').setValue(this.pendaftaran.hobi);
    this.pendaftaranForm.get('bakat').setValue(this.pendaftaran.bakat);
    this.pendaftaranForm.get('alasan').setValue(this.pendaftaran.alasan);
    this.pendaftaranForm.get('tanya').setValue(this.pendaftaran.tanya);
  }

  formValidation(): void {
    this.pendaftaranForm = this.formBuilder.group({
      nomorPendaftaran: new FormControl({ value: null, disabled: true }),
      nama: new FormControl({ value: null, disabled: true }),
      email: new FormControl({ value: null, disabled: true }),
      jenisKelamin: new FormControl({ value: null, disabled: true }),
      telp: new FormControl({ value: null, disabled: true }),
      tempatLahir: new FormControl({ value: null, disabled: true }),
      tanggalLahir: new FormControl({ value: null, disabled: true }),
      jurusan: new FormControl({ value: null, disabled: true }),
      fakultas: new FormControl({ value: null, disabled: true }),
      alamat: new FormControl({ value: null, disabled: true }),
      fileName: new FormControl({ value: null, disabled: true }),
      fileNameDokumen: new FormControl({ value: null, disabled: true }),
      hobi: new FormControl({ value: null, disabled: true }),
      bakat: new FormControl({ value: null, disabled: true }),
      alasan: new FormControl({ value: null, disabled: true }),
      tanya: new FormControl({ value: null, disabled: true }),
    });
  }

  back(): void {
    this.location.back();
  }

  downloadMyFile() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', this.pendaftaran.imageUrl);
    link.setAttribute('download', this.pendaftaran.fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  downloadMyFileDokumen() {
    if(this.pendaftaranForm.get('fileNameDokumen').value !== undefined){
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', this.pendaftaran.imageDokumenUrl);
      link.setAttribute('download', this.pendaftaran.fileNameDokumen);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }    
  }
}
