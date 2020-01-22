import { Injectable } from '@angular/core';

import { HttpClientModule }    from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Constants } from './constants'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    getUserData(): Observable<string> {
        console.log('getUserData');
        return this.http.get<string>(Constants.url_users)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.handleError<string>('getUserData', 'Error'))
            );

    }

    createUserData(body: object): Observable<string> {
        console.log('createUserData');
        return this.http.post<string>(Constants.url_users, body)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.handleError<string>('createUserData', 'Error'))
            );

    }

    updateUserData(body: object): Observable<string> {
        console.log('createUserData');
        return this.http.put<string>(Constants.url_users, body)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.handleError<string>('updateUserData', 'Error'))
            );

    }

    getVisitData(visit_id: number): Observable<string> {
        console.log('createUserData');
        console.log(visit_id);
        const params = new HttpParams().set('visit_id', String(visit_id));
        return this.http.get<string>(Constants.url_visits, {params})
        // params: new HttpParams().set('visit_id', '${visit_id}')

        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.handleError<string>('getVisitData', 'Error'))
            );

    }

    createVisitData(body: object): Observable<string> {
        console.log('createVisitData');
        return this.http.post<string>(Constants.url_visits, body)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.handleError<string>('createVisitData', 'Error'))
            );

    }

    getHostData(): Observable<string> {
        console.log('getHostData');
        return this.http.get<string>(Constants.url_hosts)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.handleError<string>('getHostData', 'Error'))
            );

    }


    private handleError<T> (operation = 'operation', result?: T) {
        // console.error('Error ocurred');
        return (error: any): Observable<T> => {

        console.error(error);
        console.log(`${operation} failed: ${error.message}`);
        return of(result as T);
        };
    }
}
