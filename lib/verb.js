/*

 VERB - last updated for NodeBox 1rc7
 Author: Tom De Smedt <tomdesmedt@organisms.be>
 See LICENSE.txt for details.

 The verb.txt morphology was adopted from the XTAG morph_englis.flat:
 http://www.cis.upenn.edu/~xtag/

 Each verb and its tenses is a list,
 indexed according to the following keys:
*/

module.exports = function(cb) {

  var verb_tenses_keys = {
    "infinitive"           : 0,
    "1st singular present" : 1,
    "2nd singular present" : 2,
    "3rd singular present" : 3,
    "present plural"       : 4,
    "present participle"   : 5,
    "1st singular past"    : 6,
    "2nd singular past"    : 7,
    "3rd singular past"    : 8,
    "past plural"          : 9,
    "past"                 : 10,
    "past participle"      : 11
  }

  var verb_tenses_aliases = {
    "inf"     : "infinitive",
    "1sgpres" : "1st singular present",
    "2sgpres" : "2nd singular present",
    "3sgpres" : "3rd singular present",
    "pl"      : "present plural",
    "prog"    : "present participle",
    "1sgpast" : "1st singular past",
    "2sgpast" : "2nd singular past",
    "3sgpast" : "3rd singular past",
    "pastpl"  : "past plural",
    "ppart"   : "past participle"
  }

  /*
    Each verb has morphs for infinitve,
    3rd singular present, present participle,
    past and past participle.
    Verbs like "be" have other morphs as well
    (i.e. I am, you are, she is, they aren't)
    Additionally, the following verbs can be negated:
    be, can, do, will, must, have, may, need, dare, ought.
  */

  var verbTenses = {}

  var fs    = require("fs");
  var path  = require("path");
  var readline = require('readline');

  var fpath     = path.join(path.dirname(__dirname), "lib", "verb.txt")
  var stream    = require('stream');
  var instream  = fs.createReadStream(fpath);
  var outstream = new stream;
  var rl = readline.createInterface(instream, outstream);

  rl.setMaxListeners(0);

  var presentParticiple, pastParticiple, verbConjugate, tense, present, past, isPresentParticiple, isPastParticiple, allTenses;

  rl.on('line', function(line){
    var a = line.trim().split(",")
    verbTenses[a[0]] = a;

  });

  rl.on('close', function() {

    // Each verb can be lemmatised:
    // inflected morphs of the verb point
    // to its infinitive in this dictionary.
    var verbLemmas = {}
    for (infinitive in verbTenses) {
      for (tense in verbTenses[infinitive]) {
        if (verbTenses[infinitive][tense] != "") {
          var t = verbTenses[infinitive][tense];
          verbLemmas[t] = infinitive;
          // verbLemmas[infinitive] = verbTenses[infinitive][tense];
        }
      }
    }
    

    // Should be an obj of arrays with the key being the lemma
    // console.log(verbTenses)
    // Inflects the verb in the present participle.
    // For example:
    // give -> giving, be -> being, swim -> swimming
    presentParticiple = function(v) {
      return verbConjugate(v, "present participle")
    }   

    // Inflects the verb in the present participle.        
    // For example:
    // give -> given, be -> been, swim -> swum
    pastParticiple = function(v) {
      return verbConjugate(v, "past participle")
    }

    // Inflects the verb to the given tense.
    // For example: be
    // present: I am, you are, she is,
    // present participle: being,
    // past: I was, you were, he was,
    // past participle: been,
    // negated present: I am not, you aren't, it isn't.
    verbConjugate = function(v, tense, negate) {
      
      tense = tense || "infinitive";
      negate = negate || false;

      v = verbInfinitive(v);
      var i = verb_tenses_keys[tense]
      
      if (negate === true) {
        i += Object.keys(verb_tenses_keys).length;
      }

      if (v) {
        return verbTenses[v][i];
      } else {
        return ""
      }
      
    }
        
    // Returns the uninflected form of the verb.
    // swimming => swim, swam => swim
    verbInfinitive = function(v) {
      if (verbLemmas[v]) {
        return verbLemmas[v];
      } else {
        return "";
      }
    }

    // Inflects the verb in the present tense.
    // The person can be specified with 1, 2, 3, "1st", "2nd", "3rd", "plural", "*".
    // Some verbs like be, have, must, can be negated.
    present = function(v, person, negate) {
      person = person || "";
      negate = negate || false;

      // person = person.replace("pl","*").strip("stndrgural")

      var hash = {
        "1" : "1st singular present",
        "2" : "2nd singular present",
        "3" : "3rd singular present",
        "*" : "present plural",
      }

      if (hash[person] && verbConjugate(v, hash[person], negate) != "") {
        return verbConjugate(v, hash[person], negate)
      } else {
        return verbConjugate(v, "infinitive", negate)  
      }
    }

    // Inflects the verb in the past tense.
    // The person can be specified with 1, 2, 3, "1st", "2nd", "3rd", "plural", "*".
    // Some verbs like be, have, must, can be negated.
    // For example:
    // give -> gave, be -> was, swim -> swam
    past = function(v, person, negate) {
      person = person || "";
      negate = negate || false;

    //     person = str(person).replace("pl","*").strip("stndrgural")
      var hash = {
        "1" : "1st singular present",
        "2" : "2nd singular present",
        "3" : "3rd singular present",
        "*" : "present plural",
      }

      if (hash[person] && verbConjugate(v, hash[person], negate) != "") {
        return verbConjugate(v, hash[person], negate)
      } else {
        return verbConjugate(v, "past", negate)  
      }
    }

    // Returns a string from verb_tenses_keys representing the verb's tense.    
    // For example:
    // given -> "past participle"
    tense = function(v) {
      var infinitive = verbInfinitive(v);
      var a = verbTenses[infinitive];
      
      if (a) {
        for (t in verb_tenses_keys) {
          if (a && a[verb_tenses_keys[t]] == v) {
            return t
          }
          
          if (a && a[verb_tenses_keys[t]+verb_tenses_keys.length] == v) {
            return t
          }
        }        
      } else {
        return null;
      }
    }

    // Checks whether the verb is in present participle.
    isPresentParticiple = function(v) {
      return (tense(v) == "present participle") ? true : false;
    }

    // Checks whether the verb is in past participle.    
    isPastParticiple = function(v) {
      return (tense(v) == "past participle") ? true : false;
    }

    // Returns all possible verb tenses.
    allTenses = function() {
      return Object.keys(verb_tenses_keys);
    }

    cb({
        presentParticiple: presentParticiple,
        pastParticiple: pastParticiple,
        present: present,
        past: past,
        tense: tense,
        isPresentParticiple: isPresentParticiple,
        isPastParticiple: isPastParticiple,

        allTenses:allTenses
      });

  });

}

// Checks whether the verb is in the given tense.
// def isTense(v, tense, negated=False):
        
//     if tense in verb_tenses_aliases:
//         tense = verb_tenses_aliases[tense]
//     if verb_tense(v) == tense:
//         return True
//     else:
//         return False
        
// Checks whether the verb is in the present tense.
// def isPresent(v, person="", negated=False):

//     person = str(person).replace("*","plural")
//     tense = verb_tense(v)
//     if tense is not None:
//         if "present" in tense and person in tense:
//             if negated is False:
//                 return True
//             elif "n't" in v or " not" in v:
//                 return True
//     return False
    


// Checks whether the verb is in the past tense.
// def isPast(v, person="", negated=False):
//     person = str(person).replace("*","plural")
//     tense = verb_tense(v)
//     if tense is not None:
//         if "past" in tense and person in tense:
//             if negated is False:
//                 return True
//             elif "n't" in v or " not" in v:
//                 return True
    
//     return False

