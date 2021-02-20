import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class JadwalPertemuanService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) {
    }

    create(data) {
        return this.angularFirestore.collection('JadwalPertemuan').add(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('JadwalPertemuan/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('JadwalPertemuan/' + key).delete();
    }

    getAll() {
        return this.angularFirestore.collection('JadwalPertemuan', ref => ref.where('idUkm', '==', JSON.parse(localStorage.getItem('ukm')).id).orderBy('dateMake', 'desc')).snapshotChanges();
    }

    getAllByUkm(idUkm) {
        return this.angularFirestore.collection('JadwalPertemuan', ref => ref.where('idUkm', '==', idUkm).orderBy('dateMake', 'desc')).snapshotChanges();
    }

    getAllForUsers() {
        return this.angularFirestore.collection('JadwalPertemuan', ref => ref.orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('JadwalPertemuan').doc(key).valueChanges();
    }
}
