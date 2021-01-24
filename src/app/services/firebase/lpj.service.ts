import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LpjService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) {
    }

    create(data) {
        return this.angularFirestore.collection('Lpj').add(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('Lpj/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('Lpj/' + key).delete();
    }

    getAll() {
        return this.angularFirestore.collection('Lpj', ref => ref.where('idUkm', '==', JSON.parse(localStorage.getItem('ukm')).id).orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('Lpj').doc(key).valueChanges();
    }
}
