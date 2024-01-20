import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Permissions } from 'src/app/entites/permissions';
import { TicketType } from 'src/app/entites/ticket-type';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';
import { AuthService } from 'src/app/services/auth.service';
import { TicketTypeService } from 'src/app/services/ticket-type.service';

@Component({
  selector: 'app-ticket-type',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.scss']
})
export class TicketTypeComponent implements OnInit {

  constructor(private ticketTypeService: TicketTypeService,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private authService: AuthService,
    private location: Location) { }

  ticketTypes: TicketType[] = [];
  ticketType: TicketType = new TicketType();


  searching: TicketType = new TicketType();
  ngOnInit(): void {
    this.getAllTicketTypes()
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

  addTicketType() {
    this.ticketTypeService.addTicketType(this.ticketType).subscribe((data: any) => {
      this.getAllTicketTypes();
      this.ticketType = new TicketType();
      this.sweetAlertMessages.alertMessage('success', "New Ticket-Type Status Added Succesfully");

    })
  }

  setEditData(id: number) {
    this.ticketTypeService.getTicketTypeById(id).subscribe((data: any) => {
      this.ticketType = data;

    })
  }

  updateTicketType() {
    this.ticketTypeService.updateTicketType(this.ticketType).subscribe((data: any) => {
      this.ticketType = new TicketType();
      this.getAllTicketTypes();
      this.sweetAlertMessages.alertMessage('success', " Ticket-Type Status Updated Succesfully");

    })
  }

  confirm(id: number) {
    this.ticketType.id = id;
  }

  deleteTicketType() {
    this.ticketTypeService.deleteTicketType(this.ticketType.id).subscribe((data: any) => {
      this.getAllTicketTypes();
      this.sweetAlertMessages.alertMessage('success', "Ticket-Type Deleted Succesfully");

    }, (err) => {
      this.sweetAlertMessages.alertMessage('error', "Something went Wrong" + err.error.status);

    })
  }



  getAllTicketTypes() {
    this.ticketTypeService.getAllTicketType(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.ticketTypes = data.content;
      this.length = data.totalElements;
    })
  }

  filter() {
    this.ticketTypeService.searchTicketType(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.ticketTypes = data.content;
    })
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
    this.getAllTicketTypes();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  }





}
