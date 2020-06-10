import { Injectable } from "@angular/core";

let content = "Prepare 2013 Marketing Plan: We need to double revenues in 2013 and our marketing strategy is going to be key here. R&D is improving existing products and creating new products so we can deliver great AV equipment to our customers.Robert, please make certain to create a PowerPoint presentation for the members of the executive team.";

@Injectable()
export class Service {
    getContent(){
        return content;
    }
}