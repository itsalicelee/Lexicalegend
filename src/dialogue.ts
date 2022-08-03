interface IDialogue{
    follow: string,
    spellCheck: string,
    image: string,
    audio: string,
    video: string,
    location: string,
    file: string,
    anotherWord: string,
    studyType: string,
    report: string,
    dictMode: string,
};


export const Dialogue: IDialogue = {
    follow: "You can type any word to look up its translation.",
    spellCheck: "Are you looking for: \n ", // + spellCheck list ,
    image: "I love this image! ❤️",
    audio: "Ooops...I'm better at recognizing words... 👀",
    video: "Thanks for sharing! 😎",
    location: "It is good people who make good places. ✨",
    file: "Stop telling people more than they need to know! 👻",
    anotherWord: 'Would you like to learn another word? 🦄',
    studyType: "What kind of exam would you like to study?",
    report: "Please report the issue in the form! 🙇‍♀️ https://forms.gle/aawPQNEYfEgwyvCi8",
    dictMode: "Back to dictionary mode 📖"
};