import { Projects } from "./projects";
import { Users } from "./users";

export class Tasks {


	id = 0;

	title = '';

	description = '';

	Tasklabels: string[] = [];
	 hours:any;

	deleted = false;
	
	startDate = '';
	relatedTo: any;

	deadline = '';
	// enum
	status = '';

	points = '';

	projectId!: Projects;

	//	@ManyToOne
	//	 Milestones milestoneId;

	assignedTo!: Users;

	collaborators: Users[] = [];


}
