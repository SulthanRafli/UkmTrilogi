import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProkerService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) {
    }

    create(data) {
        return this.angularFirestore.collection('Proker').add(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('Proker/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('Proker/' + key).delete();
    }

    getAll() {
        return this.angularFirestore.collection('Proker', ref => ref.where('idUkm', '==', JSON.parse(localStorage.getItem('ukm')).id).orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('Proker').doc(key).valueChanges();
    }
}
