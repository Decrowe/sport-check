import { Injectable } from '@angular/core';
import { getFirestore } from '@firebase/firestore';
import { FirebaseOptions, initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseConfig: FirebaseOptions = {};
  readonly app = initializeApp(this.firebaseConfig);
  readonly store = getFirestore(this.app);
}
