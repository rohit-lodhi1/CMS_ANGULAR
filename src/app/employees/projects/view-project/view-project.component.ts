import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Clients } from 'src/app/entites/clients';
import { ProjectMembers } from 'src/app/entites/project-members';
import { Projects } from 'src/app/entites/projects';
import { Users } from 'src/app/entites/users';
import { AdminProjectMemberService } from 'src/app/services/admin/admin-project-member.service';
import { AdminProjectService } from 'src/app/services/admin/admin-project.service';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { ClientsService } from 'src/app/services/clients.service';
import { saveAs } from 'file-saver'; // Import the file-saver library
import { FileService } from 'src/app/services/file.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AdminProjectFileService } from 'src/app/services/admin/admin-project-file.service';
import { Permissions } from 'src/app/entites/permissions';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AdminTasksService } from 'src/app/services/admin/admin-tasks.service';
import { Tasks } from 'src/app/entites/tasks';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit {
  imageData = new Map<string, any>();
  fileStatus = {
    status: '',
    requestType: '',
    percent: 0
  };

  constructor(private activateRoute: ActivatedRoute,
    private projectService: AdminProjectService,
    private clientService: ClientsService,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private adminUserService: AdminUsersService,
    private projectMemberService: AdminProjectMemberService,
    private fileService: AdminProjectFileService, private authService: AuthService, private location: Location,
    private taskService: AdminTasksService) {
    this.project.clientId = new Clients();
  }
  imageUrl = environment.hostUrl + '/auth/file/getImageApi/UserProfile/';
  project: Projects = new Projects();
  clients: Clients[] = [];
  employees: Users[] = [];
  selectedProjectMembers: Map<any, boolean> = new Map<any, boolean>();
  projectMembers: ProjectMembers[] = [];
  member = new ProjectMembers();

  fileId = 0;
  label: string = '';
  labels: string[] = ["HighPriority", "Urgent", "Perfect", "OnTrack", "Upcoming"]

  ngOnInit(): void {
    this.activateRoute.params.subscribe(param => {
      this.project.id = param['id'];
      this.getProjectById();
    });
    this.getProjectMemberByProjectId();
    this.getAllClients();
    this.getAllEmployees();
    this.getAllTaskByProjectId();
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

  getAllEmployees() {

    this.adminUserService.getAllEmployees(0, 2000).subscribe((data: any) => {
      this.employees = data.content;
    })
  }

  getProjectMemberByProjectId() {
    this.projectMemberService.getProjectMemberByProjectId(0, 2000, this.project.id).subscribe((data: any) => {
      this.projectMembers = data.content;
    })
  }

  getAllClients() {
    this.clientService.getAllClients(0, 100).subscribe((data: any) => {
      this.clients = data.content;
    })
  }

  getProjectById() {
    this.projectService.getProjectById(this.project.id).subscribe((data: any) => {
      this.project = data;
      this.project.files = [];
      console.log(this.project);
      this.project.images.forEach(f => {
        this.fileService.downloadFile(f.id).subscribe(event => {
          if (event.type == HttpEventType.Response)
            this.createImageFromBlob(f.originalName, event.body!)
        })
      })
    })
    this.getProjectMemberByProjectId();
    this.getAllClients();
    this.getAllEmployees();
  }


  createImageFromBlob(fileName: string, image: Blob) {

    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageData.set(fileName, reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }




  addProjectFile() {
    console.log(this.project.files);

    if (this.project.files.length > 0)
      this.fileService.addProjectFile(this.project.files, this.project.id, 'project').subscribe((data: any) => {
        this.getProjectById();
        this.sweetAlertMessages.alertMessage('success', "Project Files Added Succesfully");

      })
  }



  confirm(id: number) {
    this.fileId = id;
  }

  deleteProjectFile() {
    this.fileService.deleteProjectFileById(this.fileId, 'project').subscribe((data: any) => {
      this.sweetAlertMessages.alertMessage('info', "Project File Deleted Succesfully");
      this.getProjectById();

    })
  }



  download(id: number, fileName: string) {
    this.fileService.downloadFile(id).subscribe(
      event => {
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
        //  saveAs(new Blob([event.body!],
        //   {type:`${event.headers.get('Content-Type')};charset=utf-8`}),
        //   event.headers.get('File-Name'));
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



  selectedFile(event: any) {

    if (this.project.projectFiles.filter(f => {
      return f.originalName == event.target.files[0].name;
    }).length == 0) {
      this.project.files.push(event.target.files[0]);
      console.log(this.project.projectFiles);
    }
  }

  removeFile(file: any, isprojectFile: string) {
    if (isprojectFile == 'projectFile')
      this.project.projectFiles = this.project.projectFiles.filter(f => {
        return f.originalName != file.originalName;
      })
    else if (isprojectFile == 'image') {
      this.project.images = this.project.images.filter(f => {
        return f.originalName != file.originalName;
      })
    }
    else {
      this.project.files = this.project.files.filter(f => {
        return f.name != file.name;
      })
    }

  }



  updateProject() {

    this.projectService.updateProject(this.project).subscribe((data: any) => {
      this.getProjectById();
      this.sweetAlertMessages.alertMessage('success', "Project Updated SuccesFully");

    })
  }

  selectProjectMember(employee: any, isLeader: boolean) {
    if (this.selectedProjectMembers.get(employee) == undefined) {
      this.selectedProjectMembers.set(employee, isLeader);
      this.employees = this.employees.filter(e => {
        return e.id != employee.id;
      })
    }
    else {
      this.selectedProjectMembers.delete(employee);
      this.employees.unshift(employee);
    }

  }

  async addProjectMember() {
    let pr: ProjectMembers[] = [];
    this.selectedProjectMembers.forEach((key: boolean, value: any) => {
      this.member = new ProjectMembers();
      this.member.userId = value;
      this.member.isLeader = key;
      this.member.projectId = this.project;
      pr.push(this.member);
      console.log(value);
    })

    this.projectMemberService.addProjectMember(pr).subscribe((data: any) => {
      this.getProjectMemberByProjectId();
      this.sweetAlertMessages.alertMessage('success', "Project Members Updated Succesfully");

    });
  }


  searching() {
    if (this.label == '')
      this.getAllEmployees();
    else {
      this.employees = this.employees.filter(e => {
        return e.firstName.toLowerCase().includes(this.label.toLowerCase()) || e.lastName.toLowerCase().includes(this.label.toLowerCase());
      });
    }
  }
  addLabels(tag: any) {
    this.label = tag.value;
    let a;

    a = this.project.labels.indexOf(this.label);
    if (a == -1) {
      if (this.labels.indexOf(this.label) != -1)
        this.project.labels.push(this.label);

      this.labels = this.labels.filter(l => {
        return l != this.label;
      })
    }
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

  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  deleteProjectMember(id: any, name: string) {

    Swal.fire({
      title: ` Remove  ${name} ?`,
      text: "Do you want to Delete the task?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: '#ff9b44',
      // denyButtonColor:'',/
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.projectMemberService.deleteProjectMember(id).subscribe((data: any) => {
          this.getProjectById();
          this.sweetAlertMessages.alertMessage('info', "Project Member Removed Succesfully");

        }, err => {
          console.log(err)
          this.sweetAlertMessages.alertMessage('error', "Project Member Not  Saved" + err.error.status);
        });

      }
    });
  }



  tasks: Tasks[] = [];
  // task section
  getAllTaskByProjectId() {
    this.taskService.getAllTasksByProjectId(0, 10000, this.project.id).subscribe((data: any) => {
      this.tasks = data.content;

    })
  }



  getAllTaskByProjectIdAndStatus(status: string) {
    this.taskService.getAllTaskByProjestIdAndStatus(0, 10000, this.project.id, status).subscribe((data: any) => {
      this.tasks = data.content;
    })
  }

}
