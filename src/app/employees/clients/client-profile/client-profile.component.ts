import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clients } from 'src/app/entites/clients';
import { Projects } from 'src/app/entites/projects';
import { ImageUtil } from 'src/app/payload/image-util';
import { AdminProjectService } from 'src/app/services/admin/admin-project.service';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit{

  client:Clients = new Clients();
constructor(private activateRoute:ActivatedRoute,
  private clientService:ClientsService,
  private adminProjectService:AdminProjectService){}

  projects:Projects[]=[];
  ngOnInit(): void {
     this.activateRoute.params.subscribe((param:any)=>{
      this.client.id = param['cid'];
      this.getClient();
      this.getAllProjectOfClient();
     })
  }
  imageUtils:ImageUtil=new ImageUtil();
  imageUrl  =this.imageUtils.getImageUrl();         

  getClient(){
    this.clientService.getClientById(this.client.id).subscribe((data:any)=>{
      this.client = data;
    })
  }

getAllProjectOfClient(){
  this.adminProjectService.getProjectByClientId(0,1000,this.client.id).subscribe((data:any)=>{
      this.projects = data.content;
  })
}

}
