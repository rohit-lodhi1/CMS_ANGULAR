import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Department } from 'src/app/entites/department';
import { Designation } from 'src/app/entites/designation';
import { PerformanceAppraisal } from 'src/app/entites/performance-appraisal';
import { PerformanceIndicator } from 'src/app/entites/performance-indicator';
import { Users } from 'src/app/entites/users';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { AuthService } from 'src/app/services/auth.service';
import { DesignationService } from 'src/app/services/admin/designation.service';
import { PerfomanceaIndicatorService } from 'src/app/services/perfomancea-indicator.service';
import { PerformanceAppraisalService } from 'src/app/services/performance-appraisal.service';
import { Location } from '@angular/common';
import { Permissions } from 'src/app/entites/permissions';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-performance-appraisel',
  templateUrl: './performance-appraisel.component.html',
  styleUrls: ['./performance-appraisel.component.scss']
})
export class PerformanceAppraiselComponent implements OnInit {


  users: Users[] = [];
  performanceAppraisalList: PerformanceAppraisal[] = [];
  appraisal: PerformanceAppraisal = new PerformanceAppraisal();

  constructor(private userService: AdminUsersService,
    private authService: AuthService,
    private location: Location,
    private performanceAppraisalService: PerformanceAppraisalService
  ) {
    this.appraisal.user = new Users();
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllPerformanceAppraisal();
    this.setPermissions();
    this.setBaseUrl();
  }

  baseRoute = 'employee-dash'

  setBaseUrl() {
    this.baseRoute = this.authService.getUrl();
  }

  permissions: Permissions = new Permissions();
  setPermissions() {
    this.authService.isUserPermitted(this.location.path(), false).then(data => {
      if (data == null)
        this.authService.navigate(this.baseRoute);
      this.permissions = data;
    })
  }

  selectedEmployee(event:any){
    this.appraisal.user.id=event.value;
  }

  addPerformanceAppraisal() {

    this.performanceAppraisalService.addPerformanceAppraisal(this.appraisal).subscribe((data: any) => {
      this.appraisal = new PerformanceAppraisal();
      this.appraisal.user = new Users();
      this.alertMessage('success','Performance Appraisel  added successfully.')

      this.getAllPerformanceAppraisal();
    }
      , err => {
        alert(err.error.status);
        if(err.error.status==409){
      this.alertMessage('question','Performance Appraisel  Already present.')
        }
      }
    )
  }

  getAllUsers() {
    this.userService.getAllUsers(0, 1000).subscribe((data: any) => {
      this.users = data.content;
    },
      err => {
        console.log(err);

      });
  }
  getAllPerformanceAppraisal() {
    this.performanceAppraisalService.getAllPerformanceAppraisal(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.performanceAppraisalList = data.content;
    },
      err => {
        console.log(err);

      });
  }


  setEditData(id: number) {
    this.performanceAppraisalService.getPerformanceAppraisalByID(id).subscribe((data: any) => {
      this.appraisal = data;
    });
  }

  // updating data
  updatePerformanceAppraisal() {
    this.performanceAppraisalService.updatePerformanceAppraisal(this.appraisal).subscribe((data: any) => {
      this.getAllPerformanceAppraisal();
      this.alertMessage('success','Performance Appraisel  Updated successfully.')

    })
  }

  // setting id for delete
  confirm(id: number) {
    this.appraisal.id = id;
  }

  // delete employee
  deletePerformanceAppraisal() {
    this.performanceAppraisalService.deletePerformanceAppraisal(this.appraisal.id).subscribe((data: any) => {
      this.getAllPerformanceAppraisal();
      this.alertMessage('success','Performance Appraisel  Deleted successfully.')
    })
  }

  updateperformanceAppraisalStatus(id: number, status: string) {
    console.log(status);

    this.performanceAppraisalService.updatePerformanceAppraisalStatus(status, id).subscribe((data: any) => {
      this.getAllPerformanceAppraisal();
    });

  }

 // pagination

 length = 50;
 pageSize = 10;
 pageIndex = 0;
 pageSizeOptions = [1, 2, 5,10];

 hidePageSize = false;
 showPageSizeOptions = true;
 showFirstLastButtons = true;
 disabled = false;
 pageEvent!: PageEvent;

 handlePageEvent(e: PageEvent) {
   this.pageEvent = e;
   this.length = e.length;
   this.pageSize = e.pageSize;
   this.pageIndex = e.pageIndex;
   this.getAllPerformanceAppraisal();
 }

 setPageSizeOptions(setPageSizeOptionsInput: string) {
   if (setPageSizeOptionsInput) {
     this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
   }
  }
  alertMessage(icon:SweetAlertIcon='error',message:string='Something went wrong !!!'){
    
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
    Toast.fire({
      icon: icon,
      title: message
    })
  }
  

}



