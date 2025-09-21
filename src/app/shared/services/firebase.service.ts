import { Injectable } from '@angular/core';
import { FIREBASE_CONFIG } from '@environment';
import { Firestore, getFirestore } from '@firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private _app!: FirebaseApp;
  private _store!: Firestore;

  get app() {
    if (!this._app) this.init();
    return this._app;
  }
  get store() {
    if (!this._store) this.init();

    return this._store;
  }

  constructor() {
    this.init();
  }

  async init() {
    if (this._app) return;

    this._app = initializeApp(FIREBASE_CONFIG);
    this._store = getFirestore(this._app);
  }
}
