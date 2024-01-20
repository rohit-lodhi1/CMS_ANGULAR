import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Designation } from 'src/app/entites/designation';
import { Permissions } from 'src/app/entites/permissions';
import { Projects } from 'src/app/entites/projects';
import { Users } from 'src/app/entites/users';
import { AdminProjectFileService } from 'src/app/services/admin/admin-project-file.service';
import { AdminProjectService } from 'src/app/services/admin/admin-project.service';
import { AdminTasksService } from 'src/app/services/admin/admin-tasks.service';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeProjectCommentsService } from 'src/app/services/employee/employee-project-comments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {

  taskBoardId = 0;

  ngOnInit(): void {
    this.activateRoute.params.subscribe(param => {
      this.taskBoardId = param['id'];
    })
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

  constructor(private adminUserService: AdminUsersService,
    private taskService: AdminTasksService,
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
    private location: Location) {

  }

  updateTaskStatus(taskId: number, status: string) {

    this.taskService.updateTaskStatus(status, taskId).subscribe((data: any) => {
      Swal.fire({
        title: 'Status Update SuccesFully !!',
        text: 'Status Changed .',
        icon: 'success',
        showCancelButton: false,
      });
    }, err => {
      console.log(err)
    });
  }

}
