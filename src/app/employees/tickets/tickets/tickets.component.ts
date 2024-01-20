import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Clients } from 'src/app/entites/clients';
import { TicketType } from 'src/app/entites/ticket-type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Tickets } from 'src/app/entites/tickets';
import { Users } from 'src/app/entites/users';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { ClientsService } from 'src/app/services/clients.service';
import { TicketTypeService } from 'src/app/services/ticket-type.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { TicketRequest } from 'src/app/payload/ticket-request';
import { AuthService } from 'src/app/services/auth.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ImageUtil } from 'src/app/payload/image-util';
import { Location } from '@angular/common';

import { Permissions } from 'src/app/entites/permissions';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';



@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']

})
export class TicketsComponent implements OnInit {
  label: any;
  tickets: Tickets[] = [];
  clients: Clients[] = [];
  employees: Users[] = [];
  ticketsType: TicketType[] = [];
  searching: TicketRequest = new TicketRequest();

  addTicket: Tickets = new Tickets();

  labels: string[] = ["HighPriority", "MediumPriority", "LowPriority"];
  constructor(private ticketService: TicketsService,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private authService: AuthService,
    private clientService: ClientsService,
    private adminUserService: AdminUsersService,
    private ticketTypeService: TicketTypeService,
    private fb: FormBuilder,
    private location: Location) {

    this.addTicket.requestedBy = new Users();
    this.addTicket.client = new Clients();
    this.addTicket.ticketTypeId = new TicketType();

  }



  ngOnInit(): void {
    this.getAllTickets();
    this.getAllClients();
    this.getAllEmployee();
    this.getAllTicketTypes();
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

  tStatics: any
  getStaticsOfTicket() {
    this.ticketService.getTicketsStatics().subscribe((data: any) => {
      this.tStatics = data;
      this.setStaticsProgressOftickets();
    })
  }

  updateTicketsStatus(id: number, status: string, ofType: string) {
    this.ticketService.getticketByStatus(status, id, ofType).subscribe((data: any) => {
      this.getAllTickets();
    });
  }
  newTickets: number = 0;
  solvedtickets: number = 0;
  pendingTickets: number = 0;
  closedTickets: number = 0;

  setStaticsProgressOftickets() {
    this.newTickets = this.giveCalculations(this.tStatics[1], this.tStatics[0]) || 0;
    this.solvedtickets = this.giveCalculations(this.tStatics[2], this.tStatics[0]) || 0;
    this.pendingTickets = this.giveCalculations(this.tStatics[3], this.tStatics[0]) || 0;
    this.closedTickets = this.giveCalculations(this.tStatics[4], this.tStatics[0]) || 0;

  }
  giveCalculations(value: number, total: number): number {
    return Number(((value / total) * 100).toFixed(2));
  }
  addTickets() {

    this.ticketService.addTicket(this.addTicket).subscribe((data: any) => {
      this.getAllTickets();
      this.addTicket = new Tickets();
      this.addTicket.requestedBy = new Users();
      this.addTicket.client = new Clients();
      this.addTicket.ticketTypeId = new TicketType();
      this.addTicket.files = [];
      this.sweetAlertMessages.alertMessage('success', 'Ticket Added successfully.')


    }, err => {
      this.sweetAlertMessages.alertMessage('error', "Ticket With Error => " + err.error.status);

    });
  }


  ticket: Tickets = new Tickets();
  getTicketById(id: any) {
    this.ticketService.getTicketsById(id).subscribe((data: any) => {

      this.addTicket = data;
      this.addTicket.files = [];
      this.addTicket.ticketMembers = [];
    })
  }




  updateTickets() {
    this.ticketService.updateTicket(this.addTicket).subscribe((data: any) => {
      this.getAllTickets();
      this.sweetAlertMessages.alertMessage('success', 'Ticket Updated successfully.')

    });
  }


  selectedFile(event: any) {

    if (this.addTicket.ticketsFiles.filter(f => {
      return f.name == event.target.files[0].name;
    }).length == 0) {
      this.addTicket.files.push(event.target.files[0]);
    }

  }

  removeFile(file: any) {

    this.addTicket.files = this.addTicket.files.filter(f => {
      return f.name != file.name;
    })
  }




  getAllTicketTypes() {
    this.ticketTypeService.getAllTicketType(0, 1000).subscribe((data: any) => {
      this.ticketsType = data.content;

    });
  }



  getAllClients() {
    this.clientService.getAllClients(0, 1000).subscribe((data: any) => {
      this.clients = data.content;

    })
  }

  getAllEmployee() {
    this.adminUserService.getAllEmployees(0, 1000).subscribe((data: any) => {
      this.employees = data.content;
    })
  }


  getAllTickets() {
    this.ticketService.getAllTickets(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.tickets = data.content;
      this.getStaticsOfTicket();
      this.length = data.totalElements
    })
  }

  filter() {


    this.ticketService.searchTickets(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.tickets = data.content;

    })
  }


  deleteTicket(id: number) {
    Swal.fire({
      title: "Do you want to delete the ticket?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`
    }).then((result: { isConfirmed: any; isDenied: any; }) => {
      / Read more about isConfirmed, isDenied below /
      if (result.isConfirmed) {
        this.ticketService.deleteTickets(id).subscribe((data: any) => {
          this.getAllTickets();
          this.sweetAlertMessages.alertMessage('success', 'Ticket Deleted successfully.')
        }, (err) => {
          this.sweetAlertMessages.alertMessage('error', "Error Occured In Delete" + err.error.status);

        })
      } else if (result.isDenied) {
        this.sweetAlertMessages.alertMessage("info", "Changes are not saved")

      }
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
    this.getAllTickets();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  }

}
