import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  Router } from '@angular/router';
import { Auth } from 'src/app/entites/auth';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {


  constructor(private authService: AuthService, 
    private router: Router, private snack: MatSnackBar) {
  }
  email: any = "";
  otp: any = '';

  auth: Auth = new Auth();

  ngOnInit(): void {

  }
  otp1 = '';
  otp2 = '';
  otp3 = '';
  otp4 = '';
  // verify user by email and otp
  verifyUser() {
    this.email=localStorage.getItem('email');
    if (this.email != undefined || this.email != null)
      this.otp = this.otp1 + this.otp2 + this.otp3 + this.otp4;
    this.authService.verifyUser(this.email, this.otp).subscribe((data: any) => {
      this.router.navigate(['basicDetail'])
      Swal.fire({
        title: "Verified Details !!",
        text:"User Verified Succesfully !!",
        icon: "success"
      });
     this.otp1 = '';
     this.otp2 = '';
     this.otp3 = '';
     this.otp4 = '';
    }, (err) => {
      // this.router.navigate(['login']);
      console.log("Invalid Otp"+err.status);
      if(err.status===401){
        Swal.fire({
          title: "TimeOut?",
          text: err.error.message,
          icon: "error"
        });
      }
      if(err.status===404){
        Swal.fire({
          title: "Not Found !!",
          text: err.error.message,
          icon: "error"
        });
      }

    })
  }
  resendOpt() {
    this.email=localStorage.getItem('email');
    if (this.email != undefined || this.email != null)
       this.authService.resendOptForEmailVerification(this.email,"resend").subscribe((data: any) => {
      
        Swal.fire({
          title: "Resend Email SuccessFully!!",
          text:" Check Your  Mail Inbox !!",
          icon: "success"
        });
      }, (err) => {
        alert("Error Occured =>"+err.status);
        if(err.status===401){
          Swal.fire({
            title: "TimeOut?",
            text: err.error.message,
            icon: "error"
          });
        }
        if(err.status===404){
          Swal.fire({
            title: "Not Found !!",
            text: err.error.message,
            icon: "error"
          });
        }
    })
  }

}

