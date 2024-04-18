class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice("begin");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        
        if(locationData.Label){ this.engine.show(locationData.Label.italics()); }
        if(locationData.Choices) {
            if(locationData.Special){ this.engine.gotoScene(Special, locationData); }
            else{ this.engine.show(locationData.Body); }
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
        } else {
            this.engine.show(locationData.Body);
            this.engine.addChoice(locationData.End)
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

class Special extends Location {
    create(locationData){
        // if(locationData.Special.ID != "CARVE" ) { this.engine.show(locationData.Body.Main); }
        this.engine.show(locationData.Body.Main);
        // for(let choice of locationData.Choices) { this.engine.addChoice(choice.Text, choice); }
        switch(locationData.Special.ID){
            case "CARVE":
                if(locationData.Special.STATE == true){ 
                    for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); }
                    locationData.Special.STATE = false;
                    this.engine.storyData.Pocket["Knife"] = false;
                } else { 
                //    this.engine.show(locationData.Body.carved);  
                    
                }
                break;
            case "BASEBOARD":
                // locationData.Special.STATE = this.engine.storyData.Pocket["Knife"];
                if(this.engine.storyData.Pocket["Knife"] == true){ 
                    for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); }
                }
                locationData.Special.STATE = this.engine.storyData.Pocket["Carving"];
                if(locationData.Special.STATE == true){
                    this.engine.show(locationData.Body.Conditional);
                }
                break;
            case "KNIFE":
                locationData.Special.STATE = !(this.engine.storyData.Pocket["Knife"]);
                if(locationData.Special.STATE == true){ 
                    for(let choice of locationData["Special Choices"]) { this.engine.addChoice(choice.Text, choice); } 
                    this.engine.show(locationData.Body.Conditional);
                }
                else{ locationData.Special.ID = ""; }
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
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');