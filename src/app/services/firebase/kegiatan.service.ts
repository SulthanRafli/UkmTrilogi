import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class KegiatanService {

  constructor(
    public authService: AuthService,
    public angularFirestore: AngularFirestore
  ) {
  }

  create(data) {
    return this.angularFirestore.collection('Kegiatan').add(data);
  }

  update(key, data) {
    return this.angularFirestore.doc('Kegiatan/' + key).update(data);
  }

  delete(key) {
    return this.angularFirestore.doc('Kegiatan/' + key).delete();
  }

  getAll() {
    return this.angularFirestore.collection('Kegiatan', ref => ref.where('idUkm', '==', JSON.parse(localStorage.getItem('ukm')).id).orderBy('dateMake', 'desc')).snapshotChanges();
  }

  getAllForUsers() {
    return this.angularFirestore.collection('Kegiatan', ref => ref.orderBy('dateMake', 'desc')).snapshotChanges();
  }

  findByKey(key) {
    return this.angularFirestore.collection('Kegiatan').doc(key).valueChanges();
  }
}
