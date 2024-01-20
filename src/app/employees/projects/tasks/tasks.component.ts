import { Projects } from 'src/app/entites/projects';
import { AdminProjectService } from 'src/app/services/admin/admin-project.service';
import { EmployeeProjectCommentsService } from 'src/app/services/employee/employee-project-comments.service';
import { saveAs } from 'file-saver'; // Import the file-saver library
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AdminProjectFileService } from 'src/app/services/admin/admin-project-file.service';
import { Tasks } from 'src/app/entites/tasks';
import { Users } from 'src/app/entites/users';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { AdminTasksService } from 'src/app/services/admin/admin-tasks.service';
import Swal from 'sweetalert2';
import { Designation } from 'src/app/entites/designation';
import { commentsRequestTs } from 'src/app/entites/comments-request';
import { AuthService } from 'src/app/services/auth.service';
import { Comment } from 'src/app/entites/comment';
import { CommentSocketResponse } from 'src/app/payload/comment-socket-response';
import { Location } from '@angular/common';
import { Permissions } from 'src/app/entites/permissions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

export class TasksComponent implements OnInit {


  ngOnInit(): void {
    this.activateRoute.params.subscribe((param: any) => {

      this.project.id = param['id'];
      this.getAllProjects();
    })
    this.getAllEmployees();
    this.getUser();
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


  getUser() {
    this.user = this.authService.getUser()
  }

  constructor(private projectService: AdminProjectService,
    private adminUserService: AdminUsersService,
    private taskService: AdminTasksService,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private projectCommentService: EmployeeProjectCommentsService, private activateRoute: ActivatedRoute,
    private fileService: AdminProjectFileService,
    private location: Location,
    private authService: AuthService,
  ) {


    this.task.projectId = new Projects();
    this.task.assignedTo = new Users();
    this.searchUser.designation = new Designation();
  }


  project: Projects = new Projects();
  projects: Projects[] = [];
  tasks: Tasks[] = [];
  projectComment: commentsRequestTs = new commentsRequestTs();
  projectComments: Comment[] = [];
  task: Tasks = new Tasks();
  employees: Users[] = [];
  collabratorList: Users[] = [];
  fileStatus = {
    status: '',
    requestType: '',
    percent: 0
  };

  pageIndex = 0;
  pageSize = 1000;

  isListView = false;
  user: Users = new Users();

  getAllEmployees() {
    this.adminUserService.getAllEmployees(0, 10000).subscribe((data: any) => {
      this.employees = data.content;
      this.collabratorList = data.content;
    })
  }


  changeView(value: boolean) {
    this.isListView = value;
  }



  createProjectComment() {

    let user = this.authService.getUser()
    this.projectComment.userId = user && user.id
    this.projectComment.projectId = this.project.id;
    this.projectComment.type = 'projectComment'
    this.projectCommentService.addProjectComments(this.projectComment).subscribe((data: any) => {
      this.projectComments.push(data);

      let obj = new CommentSocketResponse()

      obj.projectId = data.projectId.id
      obj.createdAt = (data.createdAt).toString()
      obj.file = data.fileId && data.fileId.filter((e: any) => {
        return e.fileName != null
      }) as string[]
      obj.description = data.description
      obj.user = data.createdBy
      this.projectComment = new commentsRequestTs();
    })
  }



  selectProject(projectId: number) {
    this.project.id = projectId;
    this.getAllTaskByProjectId();
  }


  getAllProjects() {
    this.projectService.getAllProject(0, 10000).subscribe((data: any) => {
      this.projects = data.content;
      this.projects.filter(f => {
        if (f.id == this.project.id) {
          this.project = f;
        }

      })
      this.getAllTaskByProjectId();

    })
  }

  getAllTaskByProjectId() {
    if (this.project.id <= 0)
      this.project.id = this.projects[0].id;
    this.taskService.getAllTasksByProjectId(0, 10000, this.project.id).subscribe((data: any) => {
      this.tasks = data.content;
      this.getProjectCommentsByProjectId(this.project.id);
    })
  }


  getAllTaskByProjectIdAndStatus(status: string) {
    this.taskService.getAllTaskByProjestIdAndStatus(0, 10000, this.project.id, status).subscribe((data: any) => {
      this.tasks = data.content;
      console.log(data.content);
      this.getProjectCommentsByProjectId(this.project.id);
    })
  }


  getProjectCommentsByProjectId(id: number) {
    if (id == 0)
      id = this.projects[0].id;
    this.projectCommentService.getProjectCommentsByProjectId(0, 10000, id).subscribe((data: any) => {
      this.projectComments = data.content;
      console.log(data.content);
    })
  }



  selectedFile(event: any) {

    for (let file of event.target.files) {
      this.projectComment.files.push(file)
    }

    console.log(this.projectComment.files);

  }


  download(id: number, fileName: string) {

    this.fileService.downloadFile(id).subscribe(
      event => {
        console.log(event);

        this.reportProgress(event, fileName);

      }
    )
  }

  reportProgress(event: HttpEvent<string[] | Blob>, fileName: string) {

    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(event.loaded, event.total!, 'uploading....')
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(event.loaded, event.total!, 'Downloading...')
        break;
      case HttpEventType.ResponseHeader:
        console.log('header returned', event);
        break;
      case HttpEventType.Response:
        if (event.body instanceof Array) {
          for (const fileName of event.body) {
            // push in array
          }
        } else
          saveAs(new File([event.body!], fileName,
            { type: `${event.headers.get('Content-Type')};charset=utf-8` }

          ))
        console.log(event.headers.get('File-Name'));

        break;
      default:
        console.log(event);


    }
  }

  updateStatus(loaded: number, total: number | undefined, requestType: string) {
    this.fileStatus.status = 'Progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total!);

  }
  removeSelectedFile(name: string) {
    this.projectComment.files = this.projectComment.files.filter(f => {
      return f.name != name;
    })
    console.log(this.projectComment.files);

  }

  addTask() {
    this.task.projectId.id = this.project.id;
    this.taskService.addTasks(this.task).subscribe((data: any) => {
      this.task = new Tasks();
      this.task.projectId = new Projects();
      this.task.assignedTo = new Users();
      this.task.collaborators = [];
      this.task.Tasklabels = [];
      this.getAllTaskByProjectId();
      this.sweetAlertMessages.alertMessage('success', "Task Added To this Project " + this.project.title);

    }, err => {
      console.log(err)
      this.sweetAlertMessages.alertMessage('error', "Project Not Saved" + err.error.status);

    });
  }

  label = '';
  labels: string[] = ["HighPriority", "Urgent", "Perfect", "OnTrack", "Upcoming"]
  addLabels(tag: any) {
    this.label = tag.value;
    let a;

    a = this.task.Tasklabels.indexOf(this.label);
    if (a == -1) {
      if (this.labels.indexOf(this.label) != -1)
        this.task.Tasklabels.push(this.label);

      this.labels = this.labels.filter(l => {
        return l != this.label;
      })
      console.log(this.task.Tasklabels);
    }
  }

  selectedAssignedEmployee(event: any) {
    this.collabratorList = this.employees.filter(u => {

      return event.value != u.id;
    })
  }

  selectedCollabrators(event: any) {
    let check = false
    this.task.collaborators.filter(u => {
      if (u.id == event.value) {
        check = true;
      }
    })
    if (!check)
      this.collabratorList.filter(f => {
        if (f.id == event.value) {
          this.task.collaborators.push(f);
          check = false;
        }
      })

  }
  removeCollaberators(removeUser: any) {

    this.task.collaborators = this.task.collaborators.filter(u => {
      return u.email != removeUser.email;
    })
  }



  deleteTask(id: number) {

    Swal.fire({
      title: " Delete  Task?",
      text: "Do you want to Delete the task?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: '#ff9b44',
      // denyButtonColor:'',/
    }).then((result: any) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe((data: any) => {
          this.getAllTaskByProjectId();
          this.sweetAlertMessages.alertMessage('success', "Project deleted Succesfully");
        }, err => {
          console.log(err)
          this.sweetAlertMessages.alertMessage('error', "Project Not Saved" + err.error.status);
        });

      }
    });

  }


  updateTaskStatus(task: Tasks) {
    let status: string = '';
    if (task.status == 'Completed') {
      status = 'Todo'
    }
    else {
      status = 'Completed'
    }
    this.taskService.updateTaskStatus(status, task.id).subscribe((data: any) => {
      this.getAllTaskByProjectId();
      this.sweetAlertMessages.alertMessage('success', "Taks Status Changed Succesfully");
    }, err => {
      console.log(err)
    });
  }

  taskId: Tasks = new Tasks();

  changeTaskEmployee(task: Tasks) {
    this.taskId = task;
    this.employees = this.employees.filter(u => {

      return task.assignedTo.id != u.id;
    })

  }

  updateTaskAssignedEmployee(u: Users) {

    Swal.fire({
      title: 'Assigne Task?',
      text: 'Assigne Task : ' + this.taskId.title + '' + " to Employee :" + u.firstName + '' + u.lastName,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Update',
      denyButtonText: `Cancle`,
    }).then((result: any) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.taskService.updateTaskAssignedEmployee(u.id, this.taskId.id).subscribe((data: any) => {
          this.getAllTaskByProjectId();
          this.taskId = new Tasks();

          this.sweetAlertMessages.alertMessage('question', "Assigned Task To another Employee SuccesFully");

        }, err => {
          console.log(err)
          this.sweetAlertMessages.alertMessage('error', "Error Occured" + err.error.status);

        });
      } else if (result.isDenied) {
        this.sweetAlertMessages.alertMessage('info', "Changes Not Saved");

      }
    })
  }

  // For Serching of user through name 
  searchUser: Users = new Users();
  searchEmployeeToAddCollabrators() {
    this.adminUserService.searchEmployee(0, this.employees.length, this.searchUser).subscribe((data: any) => {
      this.collabratorList = data.content;
    })
  }

  addMoreCollabraters(data: any) {


  }


  addCollabrators() {
    this.getAllEmployees();
  }

  username: string = '';
  text: string = '';
  connected: boolean = false;

}