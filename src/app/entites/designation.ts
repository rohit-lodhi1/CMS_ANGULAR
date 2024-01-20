import { Department } from "./department";

export class Designation {
    id=0;
    title='';
    department!:Department;
    users=[];
    isDeleted=false;

    
//   constructor() {
//     this.department =new Department();
//   }

//   setDepartment(department: Department|null): void {
//     this.department = department;
//   }

//   getDepartment(): Department |null{
//     return this.department;
//   }

}
