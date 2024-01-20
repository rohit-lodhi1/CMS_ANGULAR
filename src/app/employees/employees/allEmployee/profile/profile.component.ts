import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Department } from 'src/app/entites/department';
import { Designation } from 'src/app/entites/designation';
import { Roles } from 'src/app/entites/roles';
import { UserRoles } from 'src/app/entites/user-roles';
import { Users } from 'src/app/entites/users';
import { AdminRoleService } from 'src/app/services/admin/admin-role.service';
import { AdminUserRoleService } from 'src/app/services/admin/admin-user-role.service';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/admin/department.service';
import { DesignationService } from 'src/app/services/admin/designation.service';
import { EmployeeUsersService } from 'src/app/services/employee/employeeUsers.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { EmployeeDesignationService } from 'src/app/services/employee/employee-designation.service';
import { Location } from '@angular/common';
import { Permissions } from 'src/app/entites/permissions';
import { EducationInformations } from 'src/app/entites/education-informations';
import { EmergencyContact } from 'src/app/entites/emergency-contact';
import { FamilyInformations } from 'src/app/entites/family-informations';
import { ExperienceInformations } from 'src/app/entites/experience-informations';
import { EducationInformationsService } from 'src/app/services/education-informations.service';
import { FamlyinformationtionService } from 'src/app/services/admin/famlyinformationtion.service';
import { ExperienceinformationService } from 'src/app/services/admin/experienceinformation.service';
import { PersonalInformations } from 'src/app/entites/personal-informations';
import { PersonalInformationsService } from 'src/app/services/personal-informations.service';
import { EmergencyContactService } from 'src/app/services/emergency-contact.service';
import { BankInformation } from 'src/app/entites/bank-information';
import { BankInformationService } from 'src/app/services/bank-information.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  length: any;
  constructor(private employeeUserService: EmployeeUsersService, private activateRoute: ActivatedRoute,
    private educationService: EducationInformationsService, private authService: AuthService,
    private adminRoleService: AdminRoleService,
    private adminUserRoleService: AdminUserRoleService,
    private emergencyContactservice:EmergencyContactService,
private bankInformationService:BankInformationService,
private usersService: AdminUsersService,

    private personalInformationsService:PersonalInformationsService,
    private fb: FormBuilder, private location: Location,private familyInformationService:FamlyinformationtionService
    ,private experienceInformationService:ExperienceinformationService) {
    this.myForm = this.fb.group({
      roleId: ['', [Validators.required]],
    });
    this.userRole = new UserRoles();;
  }


  imageUrl = environment.hostUrl + '/auth/file/getImageApi/UserProfile/';
  user: Users = new Users();
  confirmPassword = '';
  departments: Department[] = [];
  designations: Designation[] = [];
  isAdmin: any = false;
  roles: Roles[] = [];

  myForm: FormGroup;

  bankInformation:BankInformation=new BankInformation();
  bankInformationList:BankInformation[]=[];
  personalInformations:PersonalInformations=new PersonalInformations();
  personalInformationsList:PersonalInformations[]=[];
  emergencyContact:EmergencyContact=new EmergencyContact();
  emergencyContactList:EmergencyContact[]=[];
  userRole: UserRoles;
  userRoles: UserRoles[] = [];

  department: Department = new Department();
  designation: Designation = new Designation();
  pageIndex = 0;
  pageSize = 100;
  ngOnInit(): void {
    this.activateRoute.params.subscribe(param => {
      this.user.id = param['eid'];
      this.getUser();
      this.checkAdmin();
    })
    this.setPermissions();
    this.setBaseUrl();
    this.getBankInformationById();
    this.getAllEducationInformation();
    this.getAllFamilyInformations();
    this.getAllExperienceInformation();
    this.getEmergencyContactById();
    this.getPersonalInformationsById();
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
  getDuration(start: Date, end: Date): number {
    return end.getTime() - start.getTime();
  }

getAllEducationInformation(){

  this.educationService.getEducationInformationsByUserId(this.user.id).subscribe((data:any)=>{
if(data.length>0)
this.educationInformationList=data;
  })
}

addEducationInFormationDetails(){
  this.educationService.addEducationInformations(this.educationInformationList,this.user.id).subscribe((data:any)=>{
    this.getAllEducationInformation();
  })
}
getAllFamilyInformations(){
  this.familyInformationService.getAllFamilyInformation(this.user.id).subscribe((data:any)=>{
if(data.length>0)
    this.familyInformationList=data;

  })
}
addFamilyInformation(){
this.familyInformationService.addFamilyInformations(this.familyInformationList,this.user.id).subscribe((data:any)=>{
this.getAllFamilyInformations();
});
}
getAllExperienceInformation(){
  this.experienceInformationService.getExperienceInformationByUserId(this.user.id).subscribe((data:any)=>{
if(data.length>0)
    this.experienceInformationList=data;

  })
}
addExperienceInformation(){
this.experienceInformationService.addExperienceInformation(this.experienceInformationList,this.user.id).subscribe((data:any)=>{
this.getAllExperienceInformation();
});
}

  educationInformationList: EducationInformations[] = [new EducationInformations()];
  emergencyContactInformationList: EmergencyContact[] = [new EmergencyContact()];
  experienceInformationList: ExperienceInformations[] = [new ExperienceInformations()];
  familyInformationList: FamilyInformations[] = [new FamilyInformations()];

  addColumnForInformation(forType: String): void {
    switch (forType) {
      case "family":
        this.familyInformationList.push(new FamilyInformations());
       this.familyInformationList=this.familyInformationList.concat(this.familyInformationList)  ;

        break;

      case "education":
        this.educationInformationList.push(new EducationInformations());

        break;

      case "experience":
        this.experienceInformationList.push(new ExperienceInformations());

        break;
      default:
        break;
    }
  }

  removeItemList(index: number, forType: string): void {

    switch (forType) {
      case "family":
        if (this.familyInformationList.length > 1) {
          this.familyInformationList.splice(index, 1);
        }
        break;

      case "education":
        if (this.educationInformationList.length > 1) {
          this.educationInformationList[index].isDelete=true;
          this.educationInformationList.splice(index, 1);
        }
        break;

      case "experience":
        if (this.experienceInformationList.length > 1) {
          
          this.experienceInformationList.splice(index, 1);
        }
        break;

      default:
        break;
    }
  }

 
  // get user by id
  getUser() {
    this.employeeUserService.getEmployeeById(this.user.id).subscribe((data: any) => {
      this.user = data;
   

      if (this.user.designation === null || this.user.designation === undefined)
        this.user.designation = new Designation();


    })
  }

  selectFile(event:any){
    this.user.userImage= event.target.files[0];
  }
  

 


 // updating data
 updateEmployee() {
   
  this.usersService.updateEmployee(this.user).subscribe((data: any) => {
          this.getUser();
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
    Toast.fire({
      icon: 'success',
      title: 'Employee Details Update SuccessFully !!'
    }).then(e => {

    })

  })
  
}


  checkAdmin() {
    let roles = this.authService.getUserRoles();
    this.isAdmin = roles?.includes("ADMIN");
    if (this.isAdmin) {
      this.getAllRoles();
      this.getUserRoles();
    }
  }
  getAllRoles() {
    this.adminRoleService.getAllRoles().subscribe((data: any) => {
      this.roles = data;
    })
  }

  getUserRoles() {
    this.adminUserRoleService.getUserRolesOfUser(this.user.id).subscribe((data: any) => {
      this.userRoles = data;
    })
  }
  setEditDate(id: any) {
    this.adminUserRoleService.getUserRoleById(id).subscribe((data: any) => {
      this.userRole = data;
    })
  }

  updateUserRole() {
    this.adminUserRoleService.updateUserRole(this.userRole).subscribe((data: any) => {
      this.getUserRoles();
      this.message('success', "User Role updated Successfully!!");
    })
  }

  setDelete(id: any) {
    this.userRole.id = id;
  }
  deleteUserRole() {
    this.adminUserRoleService.deleteUserRoleBYyId(this.userRole.id).subscribe((Data: any) => {
      console.log(Data);
      this.message('success', "User Role deleted Successfully!!");
    })
  }

  addUserRole() {
    this.userRole.userId = this.user.id;
    if (this.myForm.valid)
      this.adminUserRoleService.addUserRole(this.userRole).subscribe((data: any) => {
        console.log(data);
        this.userRole = new UserRoles();
        this.message('success', "User Role Added Successfully!!");
      })
  }


  message(icon: any, message: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
    Toast.fire({
      icon: icon,
      title: message,
    });
    this.getUserRoles();
    this.userRole = new UserRoles();
  }



 // add PersonalInformations
 addPersonalInformations() {
  this.personalInformationsService.addPersonalInformations(this.personalInformations,this.user.id).subscribe((data: any) => {

    this.getPersonalInformationsById();
    this.personalInformations = new PersonalInformations();
  

  }, (err: any) => {
    console.log(err)
  });

}
// get All PersonalInformations
getPersonalInformationsById() {
  this.personalInformationsService.getPersonalInformationsById(this.user.id).subscribe((data: any) => {
    this.personalInformations = data;
    
  })
}


 // add emergencyContact
 addEmergencyContact() {
  this.emergencyContactservice.addEmergencyContact(this.emergencyContact,this.user.id).subscribe((data: any) => {

    this.getEmergencyContactById();
    this.emergencyContact = new EmergencyContact();
  

  }, (err: any) => {
    console.log(err)
  });

}  

// get All emergencyContact

getEmergencyContactById() {
  this.emergencyContactservice.getEmergencyContactById(this.user.id).subscribe((data: any) => {
    this.emergencyContact = data;
    
  })
}



 // add bankInformation
 addBankInformation() {
  this.bankInformationService.addBankInformation(this.bankInformation,this.user.id).subscribe((data: any) => {

    this.getBankInformationById();
    this.bankInformation = new BankInformation();
  

  }, (err: any) => {
    console.log(err)
  });

}

// get All bankInformation

getBankInformationById() {
  this.bankInformationService.getBankInformationById(this.user.id).subscribe((data: any) => {
    this.bankInformation = data;
    
  })
}




}
