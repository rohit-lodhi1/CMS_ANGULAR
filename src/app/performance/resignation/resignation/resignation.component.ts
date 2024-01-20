import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Permissions } from 'src/app/entites/permissions';
import { Resignation } from 'src/app/entites/resignation';
import { Users } from 'src/app/entites/users';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { AuthService } from 'src/app/services/auth.service';
import { ResignationService } from 'src/app/services/resignation.service';
import { UsersService } from 'src/app/services/users.service';
@Component({
  selector: 'app-resignation',
  templateUrl: './resignation.component.html',
  styleUrls: ['./resignation.component.scss']
})
export class ResignationComponent implements OnInit {

  resignation: Resignation = new Resignation();
  user: Users = new Users();
  resignations: Resignation[] = [];
  users: Users[] = [];
  isListView: any;

  searching: Resignation = new Resignation();


  ngOnInit(): void {
    this.getAllResignation();
    this.getAllUsers();
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



  constructor(private resignationService: ResignationService,
    private location: Location,
    private authService: AuthService,
    private userService: AdminUsersService) {
    this.resignation.employee = new Users();
    this.searching.employee = new Users();
  }
  // add assets
  addResignation() {
    console.log(this.resignation);

    this.resignationService.addResignation(this.resignation).subscribe((data: any) => {

      this.getAllResignation();
      this.resignation = new Resignation();
      this.resignation.employee = new Users();
    }, (err: any) => {
      console.log(err)
    });

  }
  // get All assets list
  getAllResignation() {
    this.resignationService.getAllResignation(this.pageIndex, this.pageSize).subscribe((data: any) => {
      console.log(data.content);
      this.resignations = data.content;
      this.length = data.totalElements;
    })
  }

  getAllUsers() {
    this.userService.getAllEmployees(this.pageIndex, this.pageSize).subscribe((data: any) => {
      console.log(data);

      this.users = data.content;
      //  this.length = data.totalElements;
    })
  }

  confirm(id: any) {
    this.resignation.id = id;
  }

  deleteResignation() {

    this.resignationService.deleteResignation(this.resignation.id).subscribe((data: any) => {
      this.getAllResignation();
    })
  }

  setEditData(id: number) {
    this.resignationService.getResignationByID(id).subscribe((data: any) => {
      this.resignation = data;
      console.log(data);
    });

  }
  updateResignation() {
    this.resignationService.updateResignation(this.resignation).subscribe((data: any) => {

      this.getAllResignation();

    })
  }


  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  }

  changeView() {
    if (!this.isListView)
      this.isListView = true
    else
      this.isListView = false
  }


  filter() {
    console.log(this.searching);

    this.resignationService.searchResignation(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.resignations = data.content;
    })
  }




  /// pagination 
  deleteId = 0;
  length = 50;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [1, 2, 5];

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
    this.getAllResignation();
  }


}


