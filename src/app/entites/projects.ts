import { Clients } from "./clients";
import { ProjectMembers } from "./project-members";
import { Tasks } from "./tasks";
import { Users } from "./users";

export class Projects {
	id = 0;
	title = '';
	description = '';

	labels: string[] = [];

	starred_by = '';

	deadline: any;

	startDate: any;

	createdDate: any;

	 priority:any;

	clientId!: Clients;

	createdBy!: Users;

	status : any;

	price: number = 0;

	projectMembers:ProjectMembers[]=[];

	projectFiles: any[] = [];
	 tasks:Tasks[]=[];
	images:any[]=[];

	files:File[]=[]

    projectType:string='';

	projectComments:Comment[]=[];

	deleted = false;
    projectId: any;
}
