import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../model/student.model';
import {URL} from '../constants';
import {Observable} from 'rxjs';
import {Teacher} from '../model/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  /**
   * Funzione che invia un oggetto student per essere savalto sul server
   * @param student da inviare
   */
  registrationStudent(student: Student): Observable<any> {
    return this.http.post<any>(URL.REGISTRATION_STUDENT, student, {observe: 'response'});
  }

  /**
   * Funzione che invia un oggetto teacher per essere savalto sul server
   * @param teacher da inviare
   */
  registrationTeacher(teacher: Teacher): Observable<any> {
    return this.http.post<any>(URL.REGISTRATION_TEACHER, teacher, {observe: 'response'});
  }
}
