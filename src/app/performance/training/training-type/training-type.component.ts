import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Permissions } from 'src/app/entites/permissions';
import { TrainingType } from 'src/app/entites/training-type';
import { AuthService } from 'src/app/services/auth.service';
import { TrainingTypeService } from 'src/app/services/training-type.service';


@Component({
  selector: 'app-training-type',
  templateUrl: './training-type.component.html',
  styleUrls: ['./training-type.component.scss']
})
export class TrainingTypeComponent implements OnInit {

  trainingType: TrainingType = new TrainingType();

  trainingTypes: TrainingType[] = [];

  isListView: any;

  searching: TrainingType = new TrainingType();


  ngOnInit(): void {
    this.getAllTrainingType();
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


  constructor(private trainingTypeService: TrainingTypeService,
    private location: Location, private authService: AuthService) {
    // this.trainingType.employee = new Users();
    // this.searching.employee = new Users();
  }
  // add assets
  addTrainingType() {
    this.trainingTypeService.addTrainingType(this.trainingType).subscribe((data: any) => {

      this.getAllTrainingType();

    }, (err: any) => {
      console.log(err)
    });

  }
  // get All assets list
  getAllTrainingType() {
    this.trainingTypeService.getAllTrainingType(this.pageIndex, this.pageSize).subscribe((data: any) => {
      console.log(data);
      this.trainingTypes = data.content;
      this.length = data.totalElements;
    })
  }

  // getAllUsers() {
  //   this.trainingTypeService.getAllEmployees(this.pageIndex, this.pageSize).subscribe((data: any) => {
  //     console.log(data);

  //     this.users = data.content;
  //   //  this.length = data.totalElements;
  //   })
  // }

  confirm(id: any) {
    this.trainingType.id = id;
  }

  deleteTrainingType() {

    this.trainingTypeService.deleteTrainingType(this.trainingType.id).subscribe((data: any) => {
      this.getAllTrainingType();
    })
  }

  setEditData(id: number) {
    this.trainingTypeService.getTrainingTypeByID(id).subscribe((data: any) => {
      this.trainingType = data;
    });

  }
  updateTrainingType() {
    this.trainingTypeService.updateTrainingType(this.trainingType).subscribe((data: any) => {

      this.getAllTrainingType();

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

    this.trainingTypeService.searchTrainingType(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.trainingType = data.content;
    })
  }

  
  updateTrainingTypeStatus(id: number, status: string) {
    console.log(status);

    this.trainingTypeService.geTrainingTypeByStatus(status, id).subscribe((data: any) => {
      this.getAllTrainingType();
    }); 
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
    this.getAllTrainingType();
  }


}
