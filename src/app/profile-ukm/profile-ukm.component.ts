import { Component, OnInit } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Ukm } from '../models/ukm.model';
import { UkmService } from '../services/firebase/ukm.service';

@Component({
  selector: 'app-profile-ukm',
  templateUrl: './profile-ukm.component.html',
  styleUrls: ['./profile-ukm.component.scss']
})
export class ProfileUkmComponent implements OnInit {

  public ukm: Ukm[];
  public loading: boolean;
  
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  
  constructor(
    public ukmService: UkmService,
  ) { }

  ngOnInit(): void {
    this.getAllUkm();
  }

  getAllUkm(): void {
    this.loading = true;
    this.ukmService.getAll().pipe(
    ).subscribe(
      (data) => {    
        this.ukm = data.map(e => {
          return {
            id: e.payload.doc.id,
            nama: e.payload.doc.data()['nama'],
            email: e.payload.doc.data()['email'],
            password: e.payload.doc.data()['password'],
            telp: e.payload.doc.data()['telp'],
            deskripsi: e.payload.doc.data()['deskripsi'],
            alamat: e.payload.doc.data()['alamat'],
            fileLogoName: e.payload.doc.data()['fileLogoName'],
            imageLogoUrl: e.payload.doc.data()['imageLogoUrl'],
            fileStrukturName: e.payload.doc.data()['fileStrukturName'],
            imageStrukturUrl: e.payload.doc.data()['imageStrukturUrl'],
          }
        });        
        this.loading = false;
      },
      (error) => {
        console.log(error);
      },
    );
  }

}
