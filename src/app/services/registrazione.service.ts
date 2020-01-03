import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Utente} from '../model/old/utente.model';
import {ChatMessage} from '../model/old/chat-message.model';
import {URL} from '../constants';
import {HttpClient} from '@angular/common/http';

export interface User {
    nome: string;
    cognome: string;
}

@Injectable({
    providedIn: 'root'
})

export class RegistrazioneService {
    public utente: Utente;

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
    }

    // MANDO NELLO STORAGE
    setStoreRegistrazione(chiave: string, utentes: Utente) {
        this.storage.set(chiave, utentes);
    }

    // MANDO AL SERVER e prevedo che torna qualcosa con l'observable
    postRegistrazione(utente: Utente): Observable<Utente> {
        return this.http.post<Utente>(URL.REGISTRAZIONE, utente);
    }

    // MANDO AL SERVER
    postRegistrazione1(utente: Utente) {
        this.http.post<Utente>(URL.REGISTRAZIONE, utente);
    }

    // PRENDO DAL SERVER
    getRegistrazione(): Observable<Utente> {
        return this.http.get<Utente>(URL.REGISTRAZIONE);
    }
}
