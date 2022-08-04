type DialogueLang = {
    en: string,
    zh: string,
}


interface IDialogue{
    follow: DialogueLang,
    spellCheck: DialogueLang,
    englishCheck: DialogueLang,
    emojiCheck_front: DialogueLang,
    emojiCheck_back: DialogueLang,
    image: DialogueLang,
    audio: DialogueLang,
    video: DialogueLang,
    location: DialogueLang,
    file: DialogueLang,
    anotherWord: DialogueLang,
    studyType: DialogueLang,
    report: DialogueLang,
    dictMode: DialogueLang,
};

//TODO: 中文dialogue
export const Dialogue: IDialogue = {
    follow: {
        en: "Let's learn vocabulary! 👩‍🏫\n\n\n✏️Type any word to search for its translation\n\n✏️Type STUDY to learn from an exam (TOEFL/GRE/TOEIC/IELTS/vocab 2000/vocab 7000).\n\n✏️Type REPORT to report bug and/or give suggestions",
        zh: "來學單字吧！👩‍🏫\n\n\n✏️輸入任何單字來查找中文翻譯\n\n✏️輸入 STUDY 來學習考試(托福/GRE/多益/雅思/2000單/7000單)中的單字\n\n✏️輸入 REPORT 以回報問題或是給予回饋",
    },
    spellCheck: {
        en: "Are you looking for: \n ", // + spellCheck list ,
        zh: "你是否在尋找： \n",
    },
    englishCheck: {
        en: "Well...Ask me again in English 👩‍💻",
        zh: "嗯......請再用英文問我一次👩‍💻",
    },
    emojiCheck_front: {
        en: "I love this emoji!",
        zh: "我喜歡這個表情符號！",
    },
    emojiCheck_back: {
        en: "If you want to look up a word, ask me without emojis! 🌝",
        zh: "如果你想要查找一個單字，記得不要加入任何表情符號呦🌝",
    },
    image: {
        en: "I love this image! ❤️",
        zh: "我喜歡這張照片！❤️",
    },
    audio: {
        en: "Ooops...I'm better at recognizing words... 👀",
        zh: "我比較會認字...... 👀",
    },
    video: {
        en: "Thanks for sharing! 😎",
        zh: "感謝分享！ 😎",
    },
    location: {
        en: "It is good people who make good places. ✨",
        zh: "有你在的地方就是好地方 ✨",
    },
    file: {
        en: "Stop telling people more than they need to know! 👻",
        zh: "不要告訴我太多秘密～ 👻",
    },
    anotherWord: {
        en: "Would you like to learn another word? 🦄",
        zh: "想要學習更其他單字嗎？ 🦄",
    },
    studyType: {
        en: "What kind of exam would you like to study? 🌱",
        zh: "你想要學習的考試是什麼呢？🌱",
    },
    report: {
        en: "Please report the issue in the form! 🙇‍♀️ https://forms.gle/aawPQNEYfEgwyvCi8",
        zh: "請回報問題在此表單中！🙇‍♀️ https://forms.gle/aawPQNEYfEgwyvCi8",
    },
    dictMode: {
        en: "Back to dictionary mode 📖",
        zh: "回到字典模式 📖",
    },
};


// console.log(Dialogue.follow[controlPanel.lang]);