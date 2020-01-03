import {Utente} from './utente.model';
import {LezioneDataOraInFin} from './lezioneDataOraInFin';


export class Lezione {
    utente: Utente;
    nomeLezione: string;
    macroMateria: string;
    microMateria: string;
    prezzoOrario: number;
    descrizione: string;
    lezioneDataOraInFin: LezioneDataOraInFin[];
}
