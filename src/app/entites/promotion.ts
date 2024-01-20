import { Designation } from "./designation";
import { Users } from "./users";

export class Promotion {
	public  id=0;

	public  employee!:Users;

	public  designationTo!:Designation;

	public  designationFrom='';

	public  promotionDate='';



	public  isDeleted=false;
}
