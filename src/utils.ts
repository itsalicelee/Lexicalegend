import { assert } from "console";
import vocab from "../lib/vocab.json";

/* Returns random int from min to max, included */
export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Given a studyType, returns any word from that wordbank
 * @param type: lowercase studyType, choose from toefl | gre | toeic
 * @returns any word from the corresponding studyType wordbank
 */
export const suggestWord = (type: string): string => {
    assert(type === 'TOEFL' || type === 'GRE' || type === 'TOEIC' || type === 'IELTS');
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
    const index = Math.floor((Math.random()*words.length));
    const result = words[index];    
    
    return result;
}
