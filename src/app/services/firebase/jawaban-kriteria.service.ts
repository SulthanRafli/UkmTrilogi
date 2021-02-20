import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class JawabanKriteriaService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) {
    }

    create(data) {
        return this.angularFirestore.collection('JawabanKriteria').add(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('JawabanKriteria/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('JawabanKriteria/' + key).delete();
    }

    getAll(nomorPendaftaran) {
        return this.angularFirestore.collection('JawabanKriteria', ref => ref.where('nomorPendaftaran', '==', nomorPendaftaran)).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('JawabanKriteria').doc(key).valueChanges();
    }
}
