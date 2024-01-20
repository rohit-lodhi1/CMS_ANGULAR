import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { AssetsService } from 'src/app/services/assets.service';

import { Assets } from 'src/app/entites/assets';
import { Users } from 'src/app/entites/users';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  asset: Assets = new Assets();
  user: Users = new Users();
  assets: Assets[] = [];
  users: Users[] = [];
  isListView: any;
 
  searching: Assets = new Assets();


  ngOnInit(): void {
    this.getAllAssets();
    this.getAllUsers();
  }

  constructor(private assetsService: AssetsService, private userService: AdminUsersService) {
    this.asset.assetUser = new Users();
    this.searching.assetUser = new Users();
  }
  // add assets
  addAssets() {
    console.log(this.asset);

    this.assetsService.addAssets(this.asset).subscribe((data: any) => {

      this.getAllAssets();
      this.asset = new Assets();
    this.asset.assetUser = new Users();

    }, (err: any) => {
      console.log(err)
    });

  }
  // get All assets list
  getAllAssets() {
    this.assetsService.getAllAssets(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.assets = data.content;
      this.length = data.totalElements;
    })
  }
  getAllUsers() {
    this.userService.getAllEmployees(this.pageIndex, 1000).subscribe((data: any) => {
      this.users = data.content;


    })
  }


  confirm(id: any) {
    this.asset.id = id;
  }

  deleteAssets() {

    this.assetsService.deleteAssets(this.asset.id).subscribe((data: any) => {
      this.getAllAssets();
    })
  }

  setEditData(id: number) {
    this.assetsService.getAssetsByID(id).subscribe((data: any) => {
      this.asset = data;
    });

  }
  updateAssets() {
    this.assetsService.updateAssets(this.asset).subscribe((data: any) => {
      this.asset = new Assets();
      this.asset.assetUser = new Users();
    
      this.getAllAssets();

    })
  }

  updateAssetsStatus(id: number, status: string) {
    console.log(status);

    this.assetsService.updateAssetsStatus(status, id).subscribe((data: any) => {
      this.getAllAssets();
    }); 
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

    this.assetsService.searchAssets(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.assets = data.content;

    })
  }





  /// pagination 
  deleteId = 0;
  length = 50;
  pageSize = 5;
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
    this.getAllAssets();
  }


}
function getAllUsers() {
  throw new Error('Function not implemented.');
}

