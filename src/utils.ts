import { assert } from "console";
import vocab from "../lib/vocab.json";

/* Returns random int from min to max, included */
export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Given a studyType, returns any word from that wordbank
 * @param type: lowercase studyType, choose from TOEFL | GRE | TOEIC | IELTS
 * @returns any word from the corresponding studyType wordbank
 */
export const suggestWord = (type: string): string => {
    //TODO: support new exam here
    assert(type === 'TOEFL' || type === 'GRE' || type === 'TOEIC' || type === 'IELTS' || type === 'JUNIOR' || type === 'SENIOR');
    var words: string[] = [];
    
    if(type === 'TOEFL'){
        words = vocab.TOEFL;
    }
    else if(type === 'GRE'){
        words = vocab.GRE;
    }
    else if(type === 'TOEIC'){
        words = vocab.TOEIC;
    }
    else if(type === 'IELTS'){
        words = vocab.IELTS;
    }
    else if(type === 'JUNIOR'){
        words = vocab.JUNIOR;
    }
    else if(type === 'SENIOR'){
        words = vocab.SENIOR;
    }
    const index = Math.floor((Math.random()*words.length));
    const result = words[index];    
    
    return result;
}
