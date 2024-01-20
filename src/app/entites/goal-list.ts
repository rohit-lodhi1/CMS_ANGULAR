import { GoalType } from "./goal-type";

export class GoalList {

    id=0;
    subject='';
    targetAchievement='';
    startDate='';
    endDate='';
    isDelete=false;
    description='';
    status='';
    goalType!:GoalType;
}
