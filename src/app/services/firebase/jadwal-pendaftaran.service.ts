import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class JadwalPendaftaranService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) {
    }

    create(data) {
        return this.angularFirestore.collection('JadwalPendaftaran').add(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('JadwalPendaftaran/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('JadwalPendaftaran/' + key).delete();
    }

    getAll() {
        return this.angularFirestore.collection('JadwalPendaftaran', ref => ref.where('idUkm', '==', JSON.parse(localStorage.getItem('ukm')).id).orderBy('dateMake', 'desc')).snapshotChanges();
    }

    getAllForUsers() {
        return this.angularFirestore.collection('JadwalPendaftaran', ref => ref.orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('JadwalPendaftaran').doc(key).valueChanges();
    }
}
