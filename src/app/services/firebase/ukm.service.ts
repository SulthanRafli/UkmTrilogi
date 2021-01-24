import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class UkmService {

    constructor(
        public angularFirestore: AngularFirestore
    ) { }

    create(uId, data) {
        return this.angularFirestore.collection('Ukm').doc(uId).set(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('Ukm/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('Ukm/' + key).delete();
    }

    getAll() {
        return this.angularFirestore.collection('Ukm', ref => ref.orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('Ukm').doc(key).valueChanges();
    }
}
