import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class KriteriaService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) {
    }

    create(data) {
        return this.angularFirestore.collection('Kriteria').add(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('Kriteria/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('Kriteria/' + key).delete();
    }

    getAll(idUkm) {
        return this.angularFirestore.collection('Kriteria', ref => ref.where('idUkm', '==', idUkm).orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('Kriteria').doc(key).valueChanges();
    }
}
