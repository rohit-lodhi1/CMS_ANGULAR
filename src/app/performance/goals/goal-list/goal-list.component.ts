import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { GoalList } from 'src/app/entites/goal-list';
import { GoalType } from 'src/app/entites/goal-type';

import { GoalListService } from 'src/app/services/goal-list.service';
import { GoalTypeComponent } from '../goal-type/goal-type.component';
import { GoalTypeService } from 'src/app/services/goal-type.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Permissions } from 'src/app/entites/permissions';


@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit {
  departmentservice: any;
  department: any;
  isListView: any;
  departments: any;
  constructor(
    private goalListService: GoalListService,
    private goaltypeService: GoalTypeService,
    private location: Location,
    private authService: AuthService
  ) {
    this.goalList.goalType = new GoalType();
    this.searching.goalType = new GoalType();

  }

  ngOnInit(): void {
    this.getAllGoalType();
    this.getAllGoalList();
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

  searching: GoalList = new GoalList();



  goalList: GoalList = new GoalList();
  goalTypeList: GoalList[] = [];
  goal: GoalType = new GoalType();
  GoalTypes: GoalType[] = [];
  todayDate: String = new Date().toLocaleDateString();

  addGoalList() {
    this.goalListService.addGoalList(this.goalList).subscribe((data: any) => {
      this.goalList = new GoalList();
      this.getAllGoalList();

    }, (err: any) => {
      console.log(err)
    });
  }

  getAllGoalType() {
    this.goaltypeService.getAllGoalTypeList().subscribe((data: any) => {
      this.GoalTypes = data;

    })
  }


  getAllGoalList() {
    this.goalListService.getAllGoalList(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.goalTypeList = data.content;
      this.length = data.totalElements;
      
    })
  }




  setEditData(id: number) {
    this.goalListService.getGoalListByID(id).subscribe((data: any) => {
      this.goalList = data;
    });

  }

  updateGoalList() {
    this.goalListService.updateGoalList(this.goalList).subscribe((data: any) => {

      this.getAllGoalList();

    })
  }


  changeView() {
    if (!this.isListView)
      this.isListView = true
    else
      this.isListView = false
  }


  filter() {

    this.goalListService.searchGoalList(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.goalTypeList = data.content;

    })
  }
  confirm(id: number) {
    this.deleteId = id;
  }

  deleteGoalList() {
    this.goalListService.deleteGoalList(this.deleteId).subscribe((data: any) => {
      this.getAllGoalList();
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
    this.getAllGoalList();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  }

  updateGoalListStatus(id: number, status: string) {
    console.log(status);

    this.goalListService.getGoalListByStatus(status, id).subscribe((data: any) => {
      this.getAllGoalList();
    });
  }
}  
