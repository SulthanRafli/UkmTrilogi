import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { Berita } from '../models/berita.model';
import { BeritaService } from '../services/firebase/berita.service';

@Component({
  selector: 'app-baca-berita',
  templateUrl: './baca-berita.component.html',
  styleUrls: ['./baca-berita.component.scss']
})
export class BacaBeritaComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public key: string;

  public berita: Berita;
  public loading: boolean;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor(
    public activatedRoute: ActivatedRoute,
    public beritaService: BeritaService,
  ) { }

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.paramMap.get('key');
    this.getBerita();
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
      },
      (error) => { },
    );
  }

}
