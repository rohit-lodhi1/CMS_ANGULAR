import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Auth } from 'src/app/entites/auth';
import { ChangePassword } from 'src/app/payload/ChangePasswordUtils';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-verification',
  templateUrl: './forget-verification.component.html',
  styleUrls: ['./forget-verification.component.scss']
})
export class ForgetVerificationComponent {

  myForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder,
    private router: Router, private snack: MatSnackBar) {
    this.myForm = this.fb.group({
      otp1: ['', [Validators.required]],
      otp2: ['', [Validators.required]],
      otp3: ['', [Validators.required]],
      otp4: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  otp: any = '';
  confirmPassword: string = '';
  auth: Auth = new Auth();

  otp1 = '';
  otp2 = '';
  otp3 = '';
  otp4 = '';


  changeForgetPassword() {
    this.otp = this.otp1 + this.otp2 + this.otp3 + this.otp4;
    alert(this.otp)
    if (this.otp.length < 4) {
      Swal.fire({
        title: "InCorrect Formate ",
        text: "Enter Correct Otp Formate!!",
        icon: "question"
      });
    }
    else {
      this.firstTaskFormControl();
      if (this.myForm.valid) {
        let email:any=localStorage.getItem('email');
        alert(email)
       this.auth.email=email;
        this.authService.changeForgetPassword(this.auth,this.otp).subscribe(
          (data: any) => {
            Swal.fire({
              title: "Password Changed ",
              text: "Enter With New Password!!",
              icon: "success"
            });
            this.otp = '';
            this.otp1 = '';
            this.otp2 = '';
            this.otp3 = '';
            this.otp4 = '';
            this.confirmPassword = '';
            this.myForm.reset();
            this.router.navigate(['login'])
          },
          (err) => {
            console.log(err.status);
            if (err.status == 400)
              Swal.fire({
                title: "Error",
                text: "Email Not Found!!",
                icon: "question"
              }); 
                if (err.status == 404)
              Swal.fire({
                title: "Error",
                text: "User Not Found!!",
                icon: "question"
              });
          })
      }
    }

  }
  public firstTaskFormControl() {
    Object.keys(this.myForm.controls).forEach(key => {
      const control = this.myForm.get(key)
        ;
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const password: any = control.get('password');
      const confirmPassword: any = control.get('confirmPassword');

      if (password.value !== confirmPassword.value) {
        return { passwordMatch: true };
      } else {
        return null;
      }
    };
  }

}
