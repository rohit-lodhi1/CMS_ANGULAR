import { Component, OnInit } from '@angular/core';
import { Designation } from 'src/app/entites/designation';
import { DesignationService } from 'src/app/services/admin/designation.service';
import { DepartmentService } from 'src/app/services/admin/department.service';
import { Department } from 'src/app/entites/department';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeDesignationService } from 'src/app/services/employee/employee-designation.service';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { Permissions } from 'src/app/entites/permissions';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent implements OnInit {

  myForm: FormGroup;
  constructor(private designationService: DesignationService
    , private fb: FormBuilder,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private departmentService: DepartmentService, private employeeDesignation: EmployeeDesignationService
    , private authService: AuthService, private location: Location) {
    this.myForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      option: ["", [Validators.required]],
      // customField: ['', [customValidator]],
    });
    this.designation.department = new Department();
    this.searching.department = new Department();

  }

  departments: Department[] = [];
  ngOnInit(): void {

    this.getAllDesignation();
    this.getAllDepartments();
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

  pageNo = 0;
  pageSize = 10;
  deleteId = 0;

  searching: Designation = new Designation();


  designations: Designation[] = [];
  designation: Designation = new Designation();

  confirmPassword = '';
  isListView = false;
  addDesignation() {
    if (this.myForm.valid) {

      this.designationService.addDesignation(this.designation).subscribe((data: any) => {
        this.sweetAlertMessages.alertMessage('success', 'Designation Added successfully.')

        this.designation = new Designation();
        this.designation.department = new Department();
        this.getAllDesignation();
        this.myForm.reset();

      }, err => {
        console.log(err)
        if (err.error.status == 409) {
          this.sweetAlertMessages.alertMessage('question', 'Designation Already successfully.')

        }
      });
    }
    else {
      return
    }

  }


  getAllDesignation() {
    this.employeeDesignation.getAllDesignation(this.pageNo, this.pageSize).subscribe((data: any) => {
      this.designations = data;

    })
  }
  getAllDepartments() {
    this.departmentService.getAllDepartment().subscribe((data: any) => {
      this.departments = data;
    })
  }

  setEditData(id: number) {
    this.designationService.getDesignationById(id).subscribe((data: any) => {
      this.designation = data;
    });

  }

  updateDesignation() {
    this.designationService.updateDesignation(this.designation).subscribe((data: any) => {
      this.sweetAlertMessages.alertMessage('success', 'Designation Updated successfully.')

      this.getAllDesignation()

    })
  }

  changeView() {
    if (!this.isListView)
      this.isListView = true
    else
      this.isListView = false
  }


  filter() {
    console.log(this.searching);

    this.designationService.searchDesignation(this.pageNo, this.pageSize, this.searching).subscribe((data: any) => {
      console.log(data)
      this.designations = data.content;
    })
  }
  setDeleteData(id: number) {
    this.deleteId = id;
  }

  deleteDesignation() {
    console.log(this.deleteId)
    this.designationService.deleteDesignation(this.deleteId).subscribe((data: any) => {
      this.getAllDesignation()
    })
  }


}

