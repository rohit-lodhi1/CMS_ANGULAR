import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permissions } from 'src/app/entites/permissions';
import { Users } from 'src/app/entites/users';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit{

  constructor(private authService:AuthService,private router:Router
    ,private location:Location){}   
  ngOnInit(): void {
      this.user=  this.authService.getUser();
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
  imageUrl = environment.hostUrl+ '/auth/file/getImageApi/UserProfile/';

  user!:Users;
  logOut(){
    this.authService.logoutUser();
    this.router.navigate(['login']);
  }


}
