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

    getUserData(user_id: number): Observable<string> {
        console.log('getUserData');
        const params = new HttpParams().set('user_id', String(user_id));
        return this.http.get<string>(Constants.url_users, {params});
        // .pipe(
        //     tap(heroes => console.log('fetched users')),
        //     catchError(this.handleError<string>('getUserData', 'Error'))
        //     );

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

    // getVisitData(visit_id: number): Observable<string> {
    //     console.log('getVisitData');
    //     const params = new HttpParams().set('visit_id', String(visit_id));
    //     return this.http.get<string>(Constants.url_visits, {params})
    //     // params: new HttpParams().set('visit_id', '${visit_id}')

    //     .pipe(
    //         tap(heroes => console.log('fetched users')),
    //         catchError(this.handleError<string>('getVisitData', 'Error'))
    //         );

    // }


    getVisitData(visit_id: number): Observable<string> {
        console.log('getVisitData');
        const params = new HttpParams().set('visit_id', String(visit_id));
        return this.http.get<string>(Constants.url_visits, {params});

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

    // createHostData(json_string: string): Observable<string> {
    //     console.log('createHostData');
    //     console.log(json_string);
    //     return this.http.post<string>(Constants.url_hosts, json_string)
    //     .pipe(
    //         tap(heroes => console.log('fetched users')),
    //         catchError(this.handleError<string>('createHostData', 'Error'))
    //         );
    // }

    createHostData(body: object): Observable<string> {
        console.log('createHostData');
        console.log(body);
        return this.http.post<string>(Constants.url_hosts, body);
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
