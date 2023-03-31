import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IUserRecord } from '../model/IUserRecord';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  baseUrl : string = "http://localhost:3000"
  urlTodos = this.baseUrl + "/usersTodos/"

  constructor(private http : HttpClient) { }

  getUserTodos(email : string): Observable<IUserRecord>{
      return this.http.get<IUserRecord>(this.urlTodos + email).pipe(
        catchError(this.handleError)
      )
  }

  updateUserRecord(email : string, updatedData : any): Observable<any>{
    return this.http.patch(this.urlTodos + email, updatedData)
  }

  addUserRecord(newData : any){
    return this.http.post(this.urlTodos, newData)
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error("Cannot get such a user todos. Such a user does not have todos yet"));
  }
}
