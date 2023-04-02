import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormControlName, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
declare let alertify: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup

  constructor(private fb : FormBuilder,public authService : AuthService){}

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}")])
      })
  }

  onSubmit(){
    if(this.loginForm.valid){
      console.log("Valid form")
      console.log(this.loginForm.value.email)
      console.log(this.loginForm.value.password)
      this.authService.SignIn(this.loginForm.value.email, this.loginForm.value.password)
    }
    else{
      this.getFormValidationErrors();
      this.displayErrorMessages()
    }
  }

  getFormValidationErrors() {
    
    console.log('%c ==>> Validation Errors: ', 'color: red; font-weight: bold; font-size:25px;');
  
    let totalErrors = 0;
  
    Object.keys(this.loginForm.controls).forEach(key => {
      const controlErrors: ValidationErrors | null = this.loginForm.get(key)!.errors;
      if (controlErrors != null) {
         totalErrors++;
         Object.keys(controlErrors).forEach(keyError => {
           console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
      }
    });
  }

  displayErrorMessages(){
      let requiredMessage = ""
      if(this.loginForm.controls['email'].hasError('required')){
        requiredMessage += "Email field is empty. "
      }
      if(this.loginForm.controls['password'].hasError('required')){
        requiredMessage += "Password field is empty. "
      }
     
      if(this.loginForm.controls['email'].hasError('email')){
        alertify.error('Incorrect email!')
      }

      if(this.loginForm.controls['password'].hasError('pattern')){
        alertify.error("Password should contain at least eight chars, at least one uppercase, at least one digit!")
      }

      if(requiredMessage.length > 0){
        requiredMessage += "Fill up empty fields!"
        alertify.error(requiredMessage);
      }

  }
}
