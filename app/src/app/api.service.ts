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

    getUserData(user_id: string): Observable<string> {
        console.log('getUserData');
        const params = new HttpParams().set('user_id', user_id);
        return this.http.get<string>(Constants.url_users, {params});

    }


    createUserData(body: object): Observable<string> {
        console.log('createUserData');
        return this.http.post<string>(Constants.url_users, body);
    }

    updateUserData(body: object): Observable<string> {
        console.log('createUserData');
        return this.http.put<string>(Constants.url_users, body)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.handleError<string>('updateUserData', 'Error'))
            );

    }

    deleteUserData(): Observable<string>{
        console.log('deleteUserData');
        return this.http.delete<string>(Constants.url_users)
    }


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

    deleteVisitData(): Observable<string>{
        console.log('deleteVisitData');
        return this.http.delete<string>(Constants.url_visits)
    }

    getHostData(): Observable<string> {
        console.log('getHostData');
        return this.http.get<string>(Constants.url_hosts)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.handleError<string>('getHostData', 'Error'))
            );

    }

    createHostData(body: object): Observable<string> {
        console.log('createHostData');
        console.log(body);
        return this.http.post<string>(Constants.url_hosts, body);
    }

    deleteHostData(): Observable<string>{
        console.log('deleteHostData');
        return this.http.delete<string>(Constants.url_hosts)
    }

    getConversationData(conv_id: number): Observable<string> {
        const params = new HttpParams().set('conversation_id', String(conv_id));
        return this.http.get<string>(Constants.url_conversations, {params});
    }

    createConversationData(body: object): Observable<string> {
        console.log('createConversationData');
        return this.http.post<string>(Constants.url_conversations, body);

    }

    updateConversationData(body: object): Observable<string> {
        console.log('updateConversationData');
        return this.http.put<string>(Constants.url_conversations, body);

    }

    deleteConversationData(): Observable<string>{
        console.log('deleteConversationData');
        return this.http.delete<string>(Constants.url_conversations)
    }

    updateCommentData(body: object): Observable<string> {
        console.log('updateCommentData');
        return this.http.put<string>(Constants.url_comments, body);

    }

    deleteStateData(): Observable<string> {
        console.log('deleteStateData');
        return this.http.delete<string>(Constants.url_state);

    }


    public handleError<T> (operation = 'operation', result?: T) {
        // console.error('Error ocurred');
        return (error: any): Observable<T> => {

        console.error(error);
        console.log(`${operation} failed: ${error.message}`);
        return of(result as T);
        };
    }
}
