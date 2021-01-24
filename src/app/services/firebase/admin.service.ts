import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(
        public authService: AuthService,
        public angularFirestore: AngularFirestore
    ) { }

    create(uId, data) {
        return this.angularFirestore.collection('Admin').doc(uId).set(data);
    }

    update(key, data) {
        return this.angularFirestore.doc('Admin/' + key).update(data);
    }

    delete(key) {
        return this.angularFirestore.doc('Admin/' + key).delete();
    }

    getAll() {
        return this.angularFirestore.collection('Admin', ref => ref.orderBy('dateMake', 'desc')).snapshotChanges();
    }

    findByKey(key) {
        return this.angularFirestore.collection('Admin').doc(key).valueChanges();
    }
}
