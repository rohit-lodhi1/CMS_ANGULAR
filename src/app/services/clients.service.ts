import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Clients } from '../entites/clients';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  baseUrl=environment.hostUrl + '/admin/clients';

  constructor(private httpClient:HttpClient) { }

  // add Client
  addClient(client:Clients){
    return this.httpClient.post(`${this.baseUrl}/`,client);
  }

  // update Client
  updateClient(client:Clients){
    return this.httpClient.put(`${this.baseUrl}/`,client);
  }

  // get Client by id
  getClientById(id:number){
     return this.httpClient.get(`${this.baseUrl}/${id}`);
  }

  // get all clients
  getAllClients(pageNo:number,pageSize:number){
     return this.httpClient.get(`${this.baseUrl}/${pageNo}/${pageSize}`);
  }

  // get all clients By Order
  getAllClientsByOrder(){
    return this.httpClient.get(`${this.baseUrl}/order`);
 }

  // delete client by id
  deleteClient(id:number){
     return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  // update Client status
  updateClientStatus(id:number,status:string){
    return this.httpClient.get(`${this.baseUrl}/status/${id}/${status}`);
  }

  // search Client
  searchClient(pageNo:number,pageSize:number,client:Clients){
    return this.httpClient.post(`${this.baseUrl}/search/${pageNo}/${pageSize}`,client);

  }
}
