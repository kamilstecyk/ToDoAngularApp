import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare let alertify: any

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  url: string = 'https://notification-app-production.up.railway.app/sendEmailv2'
  // url: string = 'http://localhost:5000/sendEmailv2'

  constructor(private http: HttpClient) { }

  async addNotification(email: string, messageContent: string, timestamp: number){

    this.http.post<any>(this.url, {
      "notificationTimestamp": timestamp,
      "destEmail": email,
      "notificationContent": messageContent,
    }).subscribe({
        next: data => {
            console.log(data.message)
            alertify.success("You have successfully added notification by email")
        },
        error: error => {
            console.error('There was an error!', error);
            alertify.error("Unfortunately there was an error while trying to set notification by email")
        }
      })

    // const content = await rawResponse.json();
    // console.log(content);
  }
}
