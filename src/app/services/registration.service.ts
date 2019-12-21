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

  registrationStudent(student: Student): Observable<any> {
    return this.http.post<any>(URL.REGISTRATION_STUDENT, student, {observe: 'response'});
  }

  registrationTeacher(teacher: Teacher): Observable<any> {
    return this.http.post<any>(URL.REGISTRATION_TEACHER, teacher, {observe: 'response'});
  }
}
