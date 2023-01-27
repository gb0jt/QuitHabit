import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

export function passMatchValidator(): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('password')?.value;
    const confPass = control.get('confPassword')?.value;

    if (pass && confPass && pass !== confPass){
      return {
        passwordsDontMatch: true
      }
    }

    return null;

  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit{

  signForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required]),
    confPassword: new FormControl('', Validators.required)
  }, { validators:passMatchValidator() });

  ngOnInit(): void {
    
  }

  constructor(
    private authService: AuthenticationService,
    private toast: HotToastService,
    private router: Router
  ){ }

  get name() {
    return this.signForm.get('name');
  }

  get email() {
    return this.signForm.get('email');
  }

  get password() {
    return this.signForm.get('password');
  }

  get confPassword() {
    return this.signForm.get('confPassword')
  }

  submit(){
    const { name, email , password} = this.signForm.value;

    if(!this.signForm.valid || !name || !email || !password) { 
      return ; 
    }
    
    this.authService.signup(name, email, password).pipe(
      this.toast.observe({
        success: 'Account sign up!',
        loading: 'Signing in...',
        error: ({ message }) => `${message}`,
      })
    ).subscribe(() => {
      this.router.navigate(['/habit-list']);
    })
  }

}
