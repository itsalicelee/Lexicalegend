import { assert } from "console";
import vocab from "../lib/vocab.json";

export const suggestToefl = (type: string): string => {
    assert(type === 'toefl' || type === 'gre' || type === 'toeic');
    var words: string[] = [];
    
    switch(type){
        case 'toefl':
            words = vocab["toefl"];
        case 'gre':
            words = vocab['gre'];
        case 'toeic':
            words = vocab['toeic'];        
    }
    return words[Math.floor((Math.random()*words.length))];
}


// console.log(suggestToefl("gre"));