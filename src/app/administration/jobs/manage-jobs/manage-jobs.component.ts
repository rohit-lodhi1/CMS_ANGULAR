import { PageEvent } from '@angular/material/paginator';
import { Department } from 'src/app/entites/department';
import { Designation } from 'src/app/entites/designation';
import { ManageJobs } from 'src/app/entites/manage-jobs';

import { Users } from 'src/app/entites/users';
import { ManageJobsService } from 'src/app/services/manage-jobs.service';

import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { DepartmentService } from 'src/app/services/admin/department.service';
import { DesignationService } from 'src/app/services/admin/designation.service';
import { EmployeeUsersService } from 'src/app/services/employee/employeeUsers.service';
import { EmployeeDesignationService } from 'src/app/services/employee/employee-designation.service';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Permissions } from 'src/app/entites/permissions';

@Component({
  selector: 'app-manage-jobs',
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.scss']
})
export class ManageJobsComponent implements OnInit {


  manageJob: ManageJobs = new ManageJobs();
  manageJobs: ManageJobs[] = [];
  searching: ManageJobs = new ManageJobs();

  constructor(private location: Location, private authService: AuthService,
    private departmentService: DepartmentService, private designationService: DesignationService,
    private manageJobService: ManageJobsService,private employeeDesignation:EmployeeDesignationService
  ) {
    this.manageJob.department = new Department();
    this.manageJob.jobTitle = new Designation();
  }


  ngOnInit(): void {
    this.getAllDesignations();
    this.getAllDepartments();
    this.getAllManageJobs();
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


  departments: Department[] = [];
  designations: Designation[] = [];



  getAllDepartments() {

    this.departmentService.getAllDepartment().subscribe((data: any) => {
      this.departments = data;
    })
  }

  getAllDesignations() {
    this.employeeDesignation.getAllDesignation(0, 1000).subscribe((data: any) => {
      this.designations = data;
    })
  }

  getAllDesignationsByDepartment(id: number) {
    this.designationService.getAllDesignationByDepartmentId(id).subscribe((data: any) => {
      this.designations = data;

    })
  }

  optionSelected(tag: any) {
    this.getAllDesignationsByDepartment(tag.value);
  }


  // adding employee
  addManageJobs() {
    this.manageJobService.addManageJobs(this.manageJob).subscribe((data: any) => {
      this.getAllManageJobs();
    }, err => {
      console.log(err)
    });

    this.manageJob.department = new Department();
    this.manageJob.jobTitle = new Designation();
    
  }

  
  getAllManageJobs() {
    this.manageJobService.getAllManageJobs(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.manageJobs = data.content;
      this.length = data.totalElements
    })
  }

  // setting data in edit form
  setEditData(id: number) {
    this.manageJobService.getManageJobById(id).subscribe((data: any) => {
      this.manageJob = data;
    });
  }

  // updating data
  updateManageJobs() {
    this.manageJobService.updateManageJob(this.manageJob).subscribe((data: any) => {
      this.getAllManageJobs();
    })
  }



  // searching the user
  filter() {
    console.log(this.searching);
    //this.searching.designation.setDepartment(null);
    this.manageJobService.searchManageJob(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.manageJobs = data.content;
    })
  }

  // setting id for delete
  confirm(id: number) {
    this.manageJob.id = id;
  }

  //  deleteManageJob
  deleteManageJob() {
    this.manageJobService.deleteManageJob(this.manageJob.id).subscribe((data: any) => {
      this.manageJobs = this.manageJobs.filter(a => {
        return a.id != this.manageJob.id;
      })
    })
  }

  

  updateManageJobStatus(id: number, status: string, ofType: string) {
    this.manageJobService.ManageJobsByStatus(status, id, ofType).subscribe((data: any) => {
      this.getAllManageJobs();
    });
  }

   // pagination

   length = 50;
   pageIndex = 0;
   pageSize=10;
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
     this.getAllManageJobs();
   }
 
   setPageSizeOptions(setPageSizeOptionsInput: string) {
     if (setPageSizeOptionsInput) {
       this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
     }
 
   }
 
   
 

}

