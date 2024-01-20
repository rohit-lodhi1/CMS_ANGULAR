import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { filter } from 'rxjs';
import { Department } from 'src/app/entites/department';
import { Designation } from 'src/app/entites/designation';
import { Promotion } from 'src/app/entites/promotion';
import { Users } from 'src/app/entites/users';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { DesignationService } from 'src/app/services/admin/designation.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeDesignationService } from 'src/app/services/employee/employee-designation.service';
import { EmployeeUsersService } from 'src/app/services/employee/employeeUsers.service';
import { PromotionService } from 'src/app/services/promotion.service';
import { Location } from '@angular/common';
import { Permissions } from 'src/app/entites/permissions';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {
  searching: Promotion = new Promotion();
  user: Users = new Users();


  users: Users[] = [];
  department: Department = new Department();
  designation: Designation = new Designation();
  confirmPassword = '';
  isListView = false;
  departments: Department[] = [];
  designations: Designation[] = [];

  promotionsList: Promotion[] = [];

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [1, 2, 5];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent!: PageEvent;
  todayDate: String = new Date().toLocaleDateString();
  promotion: Promotion = new Promotion();
  deletePromotionId = 0;
  constructor(private usersService: AdminUsersService, private employeeUserService: EmployeeUsersService,
    private location: Location, private authService: AuthService,
    private designationService: DesignationService,
    private promotionService: PromotionService, private employeeDesignation: EmployeeDesignationService
  ) {


    this.searching.employee = new Users();
    this.searching.designationTo = new Designation();
    this.user.designation = new Designation();
    this.user.designation.department = new Department();

    this.promotion.employee = new Users();
    this.promotion.designationTo = new Designation();

    this.selectedUser.designation = new Designation();
    this.selectedUser.designation.department = new Department();
  }


  ngOnInit(): void {
    this.getAllPromotions();

    this.getAllDesignations();
    this.getAllEmployees();
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


  setDeleteData(id: any) {
    this.deletePromotionId = id;
  }


  addForm() {

  }

  getAllDesignations() {
    this.employeeDesignation.getAllDesignation(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.designations = data;
    })
  }

  getAllDesignationsByDepartment(id: number) {
    this.designationService.getAllDesignationByDepartmentId(id).subscribe((data: any) => {
      this.designations = data;
    })
  }


  selectedUser: Users = new Users();
  optionSelected(tag: any) {
    this.employeeUserService.getEmployeeById(tag.value).subscribe((data: any) => {
      this.selectedUser = data;
      this.promotion.designationFrom = this.selectedUser.designation.title;
      this.getAllDesignationsByDepartment(this.selectedUser.designation.department.id);
    });

  }

  // adding promotion
  addPromotion() {
    this.promotionService.addPromotion(this.promotion).subscribe((data: any) => {

      // this.getAllEmployees();
      // this.getAllDesignations();
      this.getAllPromotions();
    }, err => {
      console.log(err)
    });

    this.promotion = new Promotion();
    this.promotion.designationTo = new Designation();
    this.promotion.employee = new Users();
  }

  // getting all promotions
  getAllPromotions() {
    this.promotionService.getAllPromotions(this.pageIndex, this.pageSize).subscribe((data: any) => {

      this.promotionsList = data.content;
      this.length = data.totalElements;
    })
  }
  // getting all Employees
  getAllEmployees() {
    this.usersService.getAllEmployees(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.users = data.content;

      this.length = data.totalElements;
    })
  }

  // setting data in edit form
  setEditData(id: number) {
    this.promotionService.getPromotionByPromotionId(id).subscribe((data: any) => {
      this.promotion = data;
    });
  }

  // updating data
  updatePromotion() {
    this.promotionService.updatePromotion(this.promotion).subscribe((data: any) => {

      this.getAllPromotions();
    })
  }

  // changing view of employee
  changeView(put: boolean) {
    this.isListView = put;
  }


  // searching the promotion
  filter() {
    this.promotionService.searchPromotionByExample(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.promotionsList = data.content;
      this.length = data.totalElements;
      // this.searching=new Promotion();
    })
  }

  // setting id for delete
  confirm(id: number) {
    this.deletePromotionId = id;
  }

  // delete employee
  deletePromotion() {
    this.promotionService.deletePromotionById(this.deletePromotionId).subscribe((data: any) => {
      this.getAllPromotions();
    })
  }


  // pagination


  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getAllPromotions();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  }



}

