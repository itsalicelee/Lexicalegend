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
