import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class PendaftaranService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) {
    }

    create(data) {
        return this.angularFirestore.collection('Pendaftaran').add(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('Pendaftaran/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('Pendaftaran/' + key).delete();
    }

    getAll(key) {
        return this.angularFirestore.collection('Pendaftaran', ref => ref.where('idUkm', '==', key).orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('Pendaftaran').doc(key).valueChanges();
    }
}
