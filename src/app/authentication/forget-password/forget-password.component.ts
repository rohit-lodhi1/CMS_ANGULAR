import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {


  myForm: FormGroup;

  constructor(private authService: AuthService, private router: Router,
    private fb: FormBuilder) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
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

  email: string = '';
  sendEmailForForgetPassword() {
    this.firstTaskFormControl();
    if (this.myForm.valid) {

      this.authService.resendOptForEmailVerification(this.email, 'forget').subscribe(
        (data: any) => {
          Swal.fire({
            title: "Emial Verified !!",
            text: "Check Your Mail Box!!",
            icon: "success"
          }).then((result) => {
            localStorage.setItem('email',this.email);
            this.myForm.reset();
            this.router.navigate(['/forget'])
          });
        },
        (err) => {
          console.log(err.status);
          if (err.status == 400)
            Swal.fire({
              title: "Error",
              text: "No Such  User With This Email!!",
              icon: "question"
            });
        })
    }
  }

}

