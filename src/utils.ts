import { controlPanel } from '..';
import vocab from "../lib/vocab.json";

/* Returns random int from min to max, included */
export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Given a studyType, returns any word from that wordbank
 * @returns any word from the corresponding studyType wordbank
 */
export const suggestWord = (): string => {
    var words: string[] = [];
    const studyType = controlPanel.studyType!;
    words = vocab[studyType];

    const index = Math.floor((Math.random()*words.length));
    const result = words[index];    
    
    return result;
}
