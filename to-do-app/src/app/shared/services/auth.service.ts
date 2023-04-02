import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';
declare let alertify: any

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(public afAuth: AngularFireAuth, // Inject Firebase auth service
  public router: Router) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
   // Sign up with email/password
   SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        // this.SendVerificationMail();
        alertify.success('You have successfully registered. Now you can log in to app!')
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error.message);

        switch (error['code']) {
          case 'auth/email-already-in-use': {
            alertify.error('Such a user exists! You can log into this account')
            break
          }
          default: {
            alertify.error('Registering error, try again later.')
            break
          }
        }
        
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

   // Sign in with email/password
   SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['/todos']);
          }
        });
      })
      .catch((error) => {
        console.log(error.message);

        switch (error['code']) {
          case 'auth/user-not-found': {
            alertify.error('Sorry user not found.')
            break
          }
          case 'auth/wrong-password': {
            alertify.error('Wrong password, try again with a new one!')
            break
          }
          default: {
            alertify.error('Login error, try again later.')
            break
          }
      }
      });
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      
    });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.userData = result.user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        console.log(result.user?.email)
        this.router.navigate(['/todos']);
      })
      .catch((error) => {
        console.log(error);
        alertify.error('Login error.')
      });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      console.log("Logout user")
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }

  // Returns true when user is looged in 
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
  }

  loggedInUserEmail(): string{
    const user = JSON.parse(localStorage.getItem('user')!);
    return user.email
  }

}
