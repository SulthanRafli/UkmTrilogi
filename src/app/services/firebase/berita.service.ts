import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class BeritaService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) {
    }

    create(data) {
        return this.angularFirestore.collection('Berita').add(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('Berita/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('Berita/' + key).delete();
    }

    getAll() {
        return this.angularFirestore.collection('Berita', ref => ref.where('idUkm', '==', JSON.parse(localStorage.getItem('ukm')).id).orderBy('dateMake', 'desc')).snapshotChanges();
    }

    getAllForUsers() {
        return this.angularFirestore.collection('Berita', ref => ref.orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('Berita').doc(key).valueChanges();
    }
}
