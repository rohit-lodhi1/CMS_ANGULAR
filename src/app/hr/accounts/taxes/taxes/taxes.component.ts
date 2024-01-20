import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Permissions } from 'src/app/entites/permissions';
import { Taxes } from 'src/app/entites/taxes';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';
import { AuthService } from 'src/app/services/auth.service';
import { TaxesService } from 'src/app/services/taxes.service';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})
export class TaxesComponent implements OnInit {

  taxe: Taxes = new Taxes();
  taxes: Taxes[] = [];
  isListView: any;
  myForm: FormGroup;

  searching: Taxes = new Taxes();

  ngOnInit(): void {
    this.getAllTaxes();
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



  constructor(private taxesService: TaxesService,
    private location: Location,    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ["", [Validators.required]],
      percentage: ["", [Validators.required]],
      status: ["", [Validators.required]],
    });

  }
  // add Trainers
  addTaxes() {
   
    this.taxesService.addTaxes(this.taxe).subscribe((data: any) => {

      this.getAllTaxes();
      this.sweetAlertMessages.alertMessage('success', 'Taxe Created successfully.')

    }, (err: any) => {
      console.log(err)
      this.sweetAlertMessages.alertMessage('error',"Error Occured In Create Taxe" +err.error.status); 

    });

  }


  // get All Training List
  getAllTaxes() {
    this.taxesService.getAllTaxes(this.pageIndex, this.pageSize).subscribe((data: any) => {
      console.log(data);
      this.taxes = data.content;
      this.length = data.totalElements;
    })
  }

  deleteId = 0;
  confirm(id: any) {
    this.deleteId = id;
  }

  deleteTaxes() {
    this.taxesService.deleteTaxes(this.deleteId).subscribe((data: any) => {
      this.getAllTaxes();
      this.sweetAlertMessages.alertMessage('success', 'Taxe Deleted successfully.')

    },err=>{
      this.sweetAlertMessages.alertMessage('error',"Error Occured In Delete Taxe " +err.error.status); 

    })
  }

  setEditData(id: number) {
    this.taxesService.getTaxesByID(id).subscribe((data: any) => {
      this.taxe = data;
      console.log(data);
    });

  }
  updateTaxes() {
    this.taxesService.updateTaxes(this.taxe).subscribe((data: any) => {
      this.sweetAlertMessages.alertMessage('success', 'Taxe Updated successfully.')

      this.getAllTaxes();

    },err=>{
      this.sweetAlertMessages.alertMessage('error',"Error Occured In Taxe Update " +err.error.status); 

    })
  }


  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  }

  changeView() {
    if (!this.isListView)
      this.isListView = true
    else
      this.isListView = false
  }


  filter() {
    console.log(this.searching);

    this.taxesService.searchTaxes(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.taxe = data.content;
    })
  }

  updateTaxesStatus(id: number, status: string) {
    console.log(status);

    this.taxesService.getTaxesByStatus(status, id).subscribe((data: any) => {
      this.getAllTaxes();
      this.sweetAlertMessages.alertMessage('success', 'Taxe Status successfully.')
    });
  }


   // pagination

   length = 50;
   pageIndex = 0;
   pageSize=10;
   pageSizeOptions = [1, 2, 5,10];
 
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
     this.getAllTaxes();
   }
 

}
