import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { matchValidator } from '../../helpers/form-validators'
declare let alertify: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup

  constructor(private fb : FormBuilder){}

  ngOnInit(): void {
      this.registerForm = this.fb.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}"), matchValidator('repeatedPassword', true)]),
        repeatedPassword: new FormControl('', [Validators.required, matchValidator('password')])
      })
  }

  onSubmit(){
    if(this.registerForm.valid){
      console.log("Valid form")
      console.log(this.registerForm.value.email)
      console.log(this.registerForm.value.password)
      console.log(this.registerForm.value.repeatedPassword)
    }
    else{
      this.getFormValidationErrors();
      this.displayErrorMessages()
    }
  }

  getFormValidationErrors() {
    
    console.log('%c ==>> Validation Errors: ', 'color: red; font-weight: bold; font-size:25px;');
  
    let totalErrors = 0;
  
    Object.keys(this.registerForm.controls).forEach(key => {
      const controlErrors: ValidationErrors | null = this.registerForm.get(key)!.errors;
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
      if(this.registerForm.controls['email'].hasError('required')){
        requiredMessage += "Email field is empty. "
      }
      if(this.registerForm.controls['password'].hasError('required')){
        requiredMessage += "Password field is empty. "
      }
      if(this.registerForm.controls['repeatedPassword'].hasError('required')){
        requiredMessage += "Repeat password field is empty. "
      }

      if(this.registerForm.controls['email'].hasError('email')){
        alertify.error('Incorrect email!')
      }

      if(this.registerForm.controls['password'].hasError('pattern')){
        alertify.error("Password should contain at least eight chars, at least one uppercase, at least one digit!")
      }

      if(this.registerForm.controls['repeatedPassword'].hasError('matching')){
        alertify.error('Passwords should be the same!')
      }

      if(requiredMessage.length > 0){
        requiredMessage += "Fill up empty fields!"
        alertify.error(requiredMessage);
      }

  }
}
