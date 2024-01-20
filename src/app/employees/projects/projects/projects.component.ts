import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Clients } from 'src/app/entites/clients';
import { Permissions } from 'src/app/entites/permissions';
import { Projects } from 'src/app/entites/projects';
import { FileSizePipe } from 'src/app/materials/utils/FileSizePipe';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';
import { ImageUtil } from 'src/app/payload/image-util';
import { AdminProjectService } from 'src/app/services/admin/admin-project.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientsService } from 'src/app/services/clients.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [FileSizePipe]
})
export class ProjectsComponent implements OnInit {

  project: Projects = new Projects();


  searching: Projects = new Projects();

  projects: Projects[] = [];
  clients: Clients[] = [];
  label: string = '';
  labels: string[] = ["HighPriority", "Urgent", "Perfect", "OnTrack", "Upcoming"]

  constructor(private clientService: ClientsService,
    private projectService: AdminProjectService,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private authService: AuthService, private location: Location) {
    this.project.clientId = new Clients();
  }
  ngOnInit(): void {
    this.getAllClients();
    this.getAllProject();
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


  imageUtils: ImageUtil = new ImageUtil();
  imageUrl = this.imageUtils.getImageUrl();




  getAllClients() {
    this.clientService.getAllClients(0, 1000).subscribe((data: any) => {
      this.clients = data.content;
       })
  }



  selectedFile(event: any) {

    if (this.project.projectFiles.filter(f => {
      return f.name == event.target.files[0].name;
    }).length == 0) {

      this.project.projectFiles.push(event.target.files[0]);
    }

  }

  removeFile(file: any) {

    this.project.projectFiles = this.project.projectFiles.filter(f => {
      return f.name != file.name;
    })
  }

  addProject() {
    this.projectService.addProject(this.project).subscribe((data: any) => {
      console.log(data);
      this.getAllProject();
      this.project = new Projects();
      this.project.clientId = new Clients();
      this.sweetAlertMessages.alertMessage('success',"Project Added Succesfully"); 

    });
  }

  setEditData(id: number) {
    this.projectService.getProjectById(id).subscribe((data: any) => {
      this.project = data;
    })
  }

  updateProject() {
    this.projectService.updateProject(this.project).subscribe((data: any) => {
       this.getAllProject();
      this.project = new Projects();
      this.project.clientId = new Clients();
      this.sweetAlertMessages.alertMessage('success',"Project Updated Succesfully"); 
    });
  }


  updateStatus(id: number, data: string, type: string) {
    if (type == 'priority') {
      this.projectService.updateProjectStatus(id, '', data).subscribe((data: any) => {
        this.sweetAlertMessages.alertMessage('success',"Project Priority Updated Succesfully"); 

        this.getAllProject();
      });
    } else if (type == 'status') {
      this.projectService.updateProjectStatus(id, data, '').subscribe((data: any) => {
        this.sweetAlertMessages.alertMessage('success',"Project Status Updated Succesfully"); 
        this.getAllProject();
      });
    }

  }


  confirm(id: number) {
    this.project.id = id;
  }

  deleteProject() {
    this.projectService.deleteProjectById(this.project.id).subscribe((data: any) => {
      this.sweetAlertMessages.alertMessage('success',"Project deleted Succesfully"); 
      this.getAllProject();

    })
  }

  getAllProject() {
    this.projectService.getAllProject(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.projects = data.content;
      this.length = data.totalElements;
      console.log(data);

    })
  }



  filter() {
    console.log(this.searching);

    this.projectService.searchProjects(this.searching).subscribe((data: any) => {
      this.projects = data;
      console.log(data);

    })
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
      console.log(this.project.labels);
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
    this.getAllProject();
  }




  isListView = false;

  changeView(value: boolean) {
    this.isListView = value;
  }

}
