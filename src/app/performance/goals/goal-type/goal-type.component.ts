import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';



import { GoalType } from 'src/app/entites/goal-type';
import { Permissions } from 'src/app/entites/permissions';
import { AuthService } from 'src/app/services/auth.service';
import { GoalTypeService } from 'src/app/services/goal-type.service';

@Component({
  selector: 'app-goal-type',
  templateUrl: './goal-type.component.html',
  styleUrls: ['./goal-type.component.scss']
})
export class GoalTypeComponent implements OnInit {
  departmentservice: any;
  department: any;
  isListView: any;
  departments: any;
  constructor(
    private goalTypeService: GoalTypeService,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getAllGoalType();
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
  searching: GoalType = new GoalType();



  goalType: GoalType = new GoalType();
  goalTypeList: GoalType[] = [];
  addGoalType() {
    this.goalTypeService.addGoalType(this.goalType).subscribe((data: any) => {
      this.goalType = new GoalType();
      this.getAllGoalType();

    }, err => {
      console.log(err)
    });
  }


  getAllGoalType() {
    this.goalTypeService.getAllGoalType(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.goalTypeList = data.content;

      this.length=data.totalElements;

    })
  }

  setEditData(id: number) {
    this.goalTypeService.getGoalTypeByID(id).subscribe((data: any) => {
      this.goalType = data;
    });

  }

  updateGoalType() {
    this.goalTypeService.updateGoalType(this.goalType).subscribe((data: any) => {

      this.getAllGoalType();

    })
  }


  changeView() {
    if (!this.isListView)
      this.isListView = true
    else
      this.isListView = false
  }


  filter() {
    // console.log(this.searching);

    this.goalTypeService.searchGoalType(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.goalTypeList = data.content;
    })
  }
  setDeleteGoalType(id: number) {
    this.deleteId = id;
  }

  deleteDepartment() {
    console.log(this.deleteId)
    this.goalTypeService.deleteGoalType(this.deleteId).subscribe((data: any) => {
      this.getAllGoalType();
    })
  }

  // pagination

  length = 50;
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
    this.getAllGoalType();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  }

  updateGoalTypeStatus(id: number, status: string) {
    console.log(status);

    this.goalTypeService.getGoalTypeByStatus(status, id).subscribe((data: any) => {
      this.getAllGoalType();
    });
  }

}



