import { Clients } from "./clients";
import { Projects } from "./projects";
import { Tasks } from "./tasks";
import { Users } from "./users";

export class TimeSheets {

	   id=0;

	  assignedHour:any='';
	  workedHours:any='';

	  timeSheetDate='';

	  description='';

	   hours:any='';


        user!:Users;


	  projectId!:Projects;

	  taskId!:Tasks;
	
	  deleted=false;	
	
}



