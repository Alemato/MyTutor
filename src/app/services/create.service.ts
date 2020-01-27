import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CreatesChat} from '../model/creates.model';
import {Observable} from 'rxjs';
import {URL} from '../constants';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CreateService {

    constructor(
        private http: HttpClient
    ) {
    }

    getListCreates(idUser: number): Observable<CreatesChat[]> {
        return this.http.get(URL.CHAT_CREATES, {observe: 'response', params: {idUser2: idUser.toString()}})
            .pipe( map((resp: HttpResponse<CreatesChat[]>) => {
            return resp.body;
        }));
    }

    postSigleCreates(idUser2: number, NameChat: string): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return  this.http.post(URL.CHAT_CREATE, {}, {observe: 'response', params: {'id-addressee': idUser2.toString(), 'chat-name': NameChat }} )
            .pipe(map((resp: HttpResponse<any>) => {
            return resp;
        }));
    }
}
