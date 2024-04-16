class Start extends Scene {
    create() {
        /*console.log(this.engine.storyData);
        console.log(this.engine.storyData.Credits);
        const key = "Credits";
        console.log(this.engine.storyData[key]);
        // note that lines 4 and 6 do the same thing 
        
       // breakpoints in chrome:
       // inspector > sources; click line number */

        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        
        if(locationData.Choices) {
            if(locationData.Special){
                if(locationData.Special.ID != "CARVE" ) { this.engine.show(locationData.Body.Main); }
                for(let choice of locationData.Choices) { this.engine.addChoice(choice.Text, choice); }
                switch(locationData.Special.ID){
                    case "CARVE":
                        if(locationData.Special.STATE == true){ 
                            this.engine.show(locationData.Body.uncarved); 
                            locationData.Special.STATE = false;
                        } else { 
                            this.engine.show(locationData.Body.carved);  
                            for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); }
                        }
                        break;
                    case "BASEBOARD":
                        locationData.Special.STATE = this.engine.storyData.Pocket["Knife"];
                        if(locationData.Special.STATE == true){ 
                            for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); } 
                            this.engine.show(locationData.Body.Conditional);
                            this.engine.storyData.Pocket["Knife"] = false;
                        }
                        else{
                            this.engine.show("this is a terrible hard code phrase. fix if possible. [write carving here!!!]");
                        }
                        break;
                    case "KNIFE":
                        locationData.Special.STATE = !(this.engine.storyData.Pocket["Knife"]);
                        if(locationData.Special.STATE == true){ 
                            for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); } 
                            this.engine.show(locationData.Body.Conditional);
                        }
                        break;
                    case "KEY":
                        locationData.Special.STATE = !(this.engine.storyData.Pocket["Key"]);
                        if(locationData.Special.STATE == true){
                            for(let choice of locationData["Special Choices"]) {
                                let obj = choice.Object;
                                this.engine.storyData.Pocket[obj] = true;
                                this.engine.addChoice(choice.Text, choice); 
                            } 
                            this.engine.show(locationData.Body.Conditional);
                        }
                        break;
                    case "PLUM":
                        locationData.Special.STATE = !(this.engine.storyData.Pocket["Seed"]);
                        if(locationData.Special.STATE == true){ 
                            for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); } 
                        }
                        break;
                    case "SHED":
                        locationData.Special.STATE = (this.engine.storyData.Pocket["Key"]);
                        if(locationData.Special.STATE == true){ 
                            for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); } 
                        }
                        break;
                    case "SPADE":
                        locationData.Special.STATE = !(this.engine.storyData.Pocket["Spade"]);
                        if(locationData.Special.STATE == true){ 
                            for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); } 
                            this.engine.show(locationData.Body.Conditional);
                        }
                        break;
                    case "DIG":
                        locationData.Special.STATE = this.engine.storyData.Pocket["Spade"];
                        if(locationData.Special.STATE == true){ 
                            for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); } 
                        }
                        break;
                    }
            }
            else{ 
                this.engine.show(locationData.Body); 
                for(let choice of locationData.Choices) {
                    if(choice.Object == null){ 
                        this.engine.addChoice(choice.Text, choice);
                    } else if(choice.Object != ""){ 
                        let obj = choice.Object;
                        this.engine.storyData.Pocket[obj] = true;
                        choice.Object = "";
                        this.engine.addChoice(choice.Text, choice); 
                    }
                }
            }
        } else {
            this.engine.addChoice("The end.")
        }
        this.engine.show("<br>");
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');