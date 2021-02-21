import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class MahasiswaService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) {
    }

    create(data) {
        return this.angularFirestore.collection('Mahasiswa').add(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('Mahasiswa/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('Mahasiswa/' + key).delete();
    }

    getAll() {
        return this.angularFirestore.collection('Mahasiswa', ref => ref.orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('Mahasiswa').doc(key).valueChanges();
    }

    findByNim(nim) {
        return this.angularFirestore.collection('Mahasiswa', ref => ref.where('nim', '==', nim).orderBy('dateMake', 'desc')).snapshotChanges();
    }
}
