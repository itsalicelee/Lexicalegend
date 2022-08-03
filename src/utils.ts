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
    assert(type === 'toefl' || type === 'gre' || type === 'toeic' || type === 'ielts');
    var words: string[] = [];
    
    if(type === 'toefl'){
        words = vocab.toefl;
    }
    else if(type === 'gre'){
        words = vocab.gre;
    }
    else if(type === 'toeic'){
        words = vocab.toeic;
    }
    else if(type === 'ielts'){
        words = vocab.ielts;
    }
    const index = Math.floor((Math.random()*words.length));
    const result = words[index];    
    
    return result;
}
