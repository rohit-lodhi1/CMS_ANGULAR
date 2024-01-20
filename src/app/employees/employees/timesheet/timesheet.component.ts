import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Permissions } from 'src/app/entites/permissions';
import { Projects } from 'src/app/entites/projects';
import { Tasks } from 'src/app/entites/tasks';
import { TimeSheets } from 'src/app/entites/time-sheets';
import { Users } from 'src/app/entites/users';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';
import { ImageUtil } from 'src/app/payload/image-util';
import { AdminProjectService } from 'src/app/services/admin/admin-project.service';
import { AdminTasksService } from 'src/app/services/admin/admin-tasks.service';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { AuthService } from 'src/app/services/auth.service';
import { TimeSheetsService } from 'src/app/services/time-sheets.service';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {

  timeSheet: TimeSheets = new TimeSheets();
  timeSheets: TimeSheets[] = [];


  project: Projects = new Projects();

  projects: Projects[] = [];

  ngOnInit(): void {
    this.getAllProjects();
    this.setPermissions();
    this.getAllTimeSheet()
    this.setBaseUrl();
  }

  baseRoute = 'employee-dash'

  setBaseUrl() {
    this.baseRoute = this.authService.getUrl();
  }

  imageUtils: ImageUtil = new ImageUtil();
  imageUrl = this.imageUtils.getImageUrl();

  permissions: Permissions = new Permissions();
  setPermissions() {
    this.authService.isUserPermitted(this.location.path(), false).then(data => {
      if (data == null)
        this.authService.navigate(this.baseRoute);
      this.permissions = data;
    })
  }


  constructor(private projectService: AdminProjectService
    , private taskService: AdminTasksService, private timeSheetsService: TimeSheetsService,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private authService: AuthService, private location: Location) {
    this.timeSheet.projectId = new Projects();
    this.timeSheet.taskId = new Tasks();
    this.timeSheet.taskId.assignedTo = new Users();
  }




  onProjectSelect(inp: any) {
    this.projectService.getProjectById(inp.value).subscribe((data: any) => {
      this.project = data;
      this.timeSheet.projectId.id = this.project.id;
      this.timeSheet.projectId.deadline = this.project.deadline;
      //  this.timeSheet.projectId.tasks=this.project.tasks;
      this.getAllTaskByProjectId(inp.value);
    })
  }

  task: Tasks = new Tasks();
  onTaskSelect(inp: any) {
    this.taskService.getTaskById(inp.value).subscribe((data: any) => {
      this.task = data;
      this.timeSheet.taskId.hours = this.task.hours;
      this.timeSheet.taskId.assignedTo.firstName = this.task.assignedTo.firstName;

    })
  }




  addTimeSheets() {
    this.timeSheetsService.addTimeSheets(this.timeSheet).subscribe((data: any) => {
      this.timeSheet = new TimeSheets();
      this.timeSheet.projectId = new Projects();
      this.timeSheet.taskId = new Tasks();
      this.sweetAlertMessages.alertMessage('success', 'Your TimeSheet  Added successfully.')

      this.getAllTimeSheet();

    }, (err: any) => {
      console.log(err)
      this.sweetAlertMessages.alertMessage('question', err.error.status);
    });
  }

  getAllTimeSheet() {
    this.timeSheetsService.getAllTimeSheets(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.timeSheets = data.content;
    })
  }

  getAllProjects() {
    this.projectService.getAllProject(0, 10000).subscribe((data: any) => {
      this.projects = data.content;
    });
  }


  tasksList: Tasks[] = []
  getAllTaskByProjectId(id: number) {
    this.taskService.getAllTasksByProjectId(0, 10000, id).subscribe((data: any) => {
      this.tasksList = data.content;
    })
  }


  getTotalHoursBetweenDates(startDate: Date, endDate: Date): number {
    // Calculate the time difference in milliseconds
    const timeDifference = endDate.getTime() - startDate.getTime();

    // Calculate the total hours
    const totalHours = timeDifference / (1000 * 60 * 60);

    return totalHours;
  }


  getProjectsDetails() {
    this.projectService.getAllProjects().subscribe((data: any) => {
      this.project = data;
    });
  }


  // pagination

  length = 50;
  pageSize = 10;
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
    this.getAllTimeSheet();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  calculateRemainingHour() {
    this.timeSheet.workedHours = this.timeSheet.taskId.hours - this.timeSheet.hours;
  }




  setEditData(id: number) {
    this.timeSheetsService.getTimeSheetsById(id).subscribe((data: any) => {
      this.timeSheet = data;
    })
  }

  updateTimeSheet() {
    this.timeSheetsService.updateTimeSheets(this.timeSheet).subscribe((data: any) => {
      this.timeSheet = new TimeSheets();
      this.getAllTimeSheet();
    })
  }

  confirm(id: number) {
    this.timeSheet.id = id;
  }

  deleteTimeSheet() {
    this.timeSheetsService.deleteTimeSheets(this.timeSheet.id).subscribe((data: any) => {
      this.getAllTimeSheet();
      this.sweetAlertMessages.alertMessage('success', 'TimeSheet  Deleted successfully.')

    })
  }



}
