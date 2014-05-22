var verb = require("../")

verb(function(v){
    console.log(v.presentParticiple("swim"));
    console.log(v.presentParticiple("swam"));
    console.log(v.presentParticiple("swimming"));
    console.log(v.present("have", "3"));
    console.log(v.past("swim"));
    console.log(v.pastParticiple("give"));
    console.log(v.tense("was"));
    console.log(v.isPresentParticiple("done"));
    console.log(v.pastParticiple("study"));
    console.log(v.allTenses());

    console.log(v.past("she"));
});
