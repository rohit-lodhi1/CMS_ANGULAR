import { Component, OnInit } from '@angular/core';
import { Clients } from 'src/app/entites/clients';
import { Currency } from 'src/app/entites/currency';
import { Users } from 'src/app/entites/users';
import { ClientsService } from 'src/app/services/clients.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { PageEvent } from '@angular/material/paginator';
import { Designation } from 'src/app/entites/designation';
import { ImageUtil } from 'src/app/payload/image-util';
import { AuthService } from 'src/app/services/auth.service';
import { Permissions } from 'src/app/entites/permissions';
import { Location } from '@angular/common';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit{
  users:Users[]=[];
  
client:Clients = new Clients();
clients:Clients[]=[];
search:Clients = new Clients();

isListView=false;
currencies:Currency[]=[];


constructor(private userService:AdminUsersService,
  private location :Location,    private sweetAlertMessages: SweetAlertMessagesProvidersService,

   private clientService:ClientsService,private currencyService:CurrencyService,
  private authService:AuthService){
  this.client.owner=new Users();
}
  ngOnInit(): void {
   this.getAllEmployees();
    this.getAllCurrencies();
    this.getAllClients();
    this.setPermissions();
    this.setBaseUrl();
    }
  
    baseRoute='employee-dash'
    
    setBaseUrl(){
      this.baseRoute = this.authService.getUrl();
    }
    
      permissions:Permissions=new Permissions();
      setPermissions(){
        this.authService.isUserPermitted(this.location.path(),false).then(data=>{
          if(data==null)
          this.authService.navigate(this.baseRoute);
             this.permissions =  data;
        }) 
      }
   
  imageUtils:ImageUtil=new ImageUtil();
  imageUrl  =this.imageUtils.getImageUrl();         

 

  getAllEmployees() {
    this.userService.getAllEmployees(0, 100).subscribe((data: any) => {
      this.users = data.content;
     
    })
  }


  
  addForm(){
    this.client=new Clients();
  }
 

getAllCurrencies(){
  this.currencyService.getAllCurrency().subscribe((data:any)=>{
     this.currencies = data.currencies;
 
  })
}

addClient(){
  
   this.clientService.addClient(this.client).subscribe((data:any)=>{
    this.sweetAlertMessages.alertMessage('success',"Client Added Succesfully"); 
    this.getAllClients();
   })
   
}

setEditData(id:number){
  this.clientService.getClientById(id).subscribe((data:any)=>{
      this.client = data;
  })
}

updateClient(){
  
  this.clientService.updateClient(this.client).subscribe((data:any)=>{
    this.sweetAlertMessages.alertMessage('success',"Client Updated Succesfully"); 
     this.getAllClients();
  })
}

confirm(id:number){
  this.client.id=id;
}

deleteClient(){
  this.clientService.deleteClient(this.client.id).subscribe((data:any)=>{
    this.sweetAlertMessages.alertMessage('success',"Client Deleted Succesfully"); 
     this.getAllClients()
  })
}

getAllClients(){
  this.clientService.getAllClients(this.pageIndex,this.pageSize).subscribe((data:any)=>{
     this.clients = data.content;
     this.length = data.totalElements;
  })
}

// update Client Status
updateClientStatus(id:number,status:string){
  this.clientService.updateClientStatus(id,status).subscribe((data:any)=>{
    this.sweetAlertMessages.alertMessage('success',"Client Status Changed to  "+status+" Succesfully"); 
    this.getAllClients();
  });
}

// search client 
searchClient(){
  console.log(this.search);  
  this.search.owner.designation=new Designation();
  this.clientService.searchClient(this.pageIndex,this.pageSize,this.search).subscribe((data:any)=>{
    this.clients=data.content;
    
    this.length=data.totalElements;
  })
}


 // changing view of employee
 changeView(put:boolean) {
   this.isListView=put;
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
  this.getAllClients();
}

setPageSizeOptions(setPageSizeOptionsInput: string) {
  if (setPageSizeOptionsInput) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

}



}
