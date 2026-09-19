
const languageNameList = {
  Hiragana: "ひらがな",
  Romaji: "ローマ字",
  Thai: "タイ語",
  Korean: "ハングル",
  Arabic: "アラビア語",
  Hebrew: "ヘブライ語",
  Russian: "ロシア語",
  Georgian: "ジョージア語",
  Armenian:　"アルメニア語",
  Greek:	"ギリシャ語",
  Tibetan: "チベット語",
  Hindi: "ヒンディー語",
  Sinhalese:"シンハラ語",
  Tamil:"タミル語",
  Khmer:"クメール語",
  Amharic:"アムハラ語",
  Burmese: "ビルマ語"
}

const languageNameListEn = {
  Hiragana:"Hiragana",
  Romaji:"Romaji",
  Thai:"Thai",
  Korean:"Korean",
  Arabic: "Arabic",
  Hebrew: "Hebrew",
  Russian: "Russian",
  Georgian: "Georgian",
  Armenian: "Armenian",
  Greek: "Greek",
  Tibetan: "Tibetan",
  Hindi: "Hindi",
  Sinhalese: "Sinhalese",
  Tamil: "Tamil",
  Khmer: "Khmer",
  Amharic: "Amharic",
  Burmese: "Burmese"
}
const languages = ["Hiragana", "Romaji", "Thai", "Korean", "Arabic", "Hebrew", "Russian", "Georgian", "Armenian", "Greek", "Tibetan", "Hindi", "Sinhalese", "Tamil", "Khmer", "Amharic", "Burmese"];
const speechLanguageCodes = {
  "Hiragana": "ja-JP",
  "Romaji": "en-US",
  "Thai": "th-TH",
  "Korean": "ko-KR",
  "Arabic": "ar-SA",
  "Hebrew": "he-IL",
  "Russian": "ru-RU",
  "Georgian": "ka-GE",
  "Armenian": "hy-AM",
  "Greek": "el-GR",
  "Tibetan": "bo",
  "Hindi": "hi-IN",
  "Sinhalese": "si-LK",
  "Tamil": "ta-IN",
  "Khmer": "km-KH",
  "Amharic": "am-ET",
  "Burmese": "my-MM"
};

const Transliterator = window.Transliterator;
const honja = new Transliterator();
const speechSynth = window.speechSynthesis;

// Chromeはローカル変数しか参照しないUtteranceをGCしてしまい、無音になることがあるため、
// 発話が終わるまで参照を保持しておく。
let currentUtterance = null;

// 直近の変換結果。voiceschangedで音声一覧が後から届いたときに再描画するために保持する。
let lastResult = null;

function findVoiceForLang(langCode) {
  if (!speechSynth) {
    return null;
  }
  const voices = speechSynth.getVoices();
  return voices.find(voice => voice.lang === langCode) ||
    voices.find(voice => voice.lang.split("-")[0] === langCode.split("-")[0]);
}

function speakText(lang, text) {
  const voice = findVoiceForLang(speechLanguageCodes[lang] || "ja-JP");
  if (!speechSynth || !voice) {
    return;
  }
  speechSynth.cancel();
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = voice.lang;
  currentUtterance.voice = voice;
  speechSynth.speak(currentUtterance);
}

function renderResultTable(result) {
  const table = document.getElementById("honja-result");
  table.innerHTML = "";

  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>言語</th><th>結果</th></tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  languages.forEach(language => {
    const row = document.createElement("tr");

    const languageCell = document.createElement("td");
    languageCell.setAttribute("nowrap", "");
    languageCell.textContent = languageNameList[language];
    row.appendChild(languageCell);

    const resultCell = document.createElement("td");
    const resultText = result[language];

    const voice = findVoiceForLang(speechLanguageCodes[language] || "ja-JP");
    if (voice) {
      const speakButton = document.createElement("button");
      speakButton.type = "button";
      speakButton.className = "speak-button";
      speakButton.setAttribute("aria-label", "発音を再生");
      speakButton.addEventListener("click", () => speakText(language, resultText));
      resultCell.appendChild(speakButton);
    }

    const resultSpan = document.createElement("span");
    resultSpan.textContent = resultText;
    resultCell.appendChild(resultSpan);

    row.appendChild(resultCell);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
}

function tryHonja() {
  let text = document.getElementById("input-text").value.replaceAll("<", "").replaceAll(">", "").replaceAll("'", "").replaceAll("\"", "").replaceAll("&");
  if (text.trim() === "") {
    text = "しぶや　しんじゅく　あきはばら";
    document.getElementById("input-text").value = text;
  }
  let result = honja.convertAll(text);
  console.info(result);

  lastResult = result;
  renderResultTable(result);

  document.getElementById("source").innerHTML = '<a href="https://github.com/TakutoYoshikai/honja">Source Code 👉 TakutoYoshikai/honja</a>';

}

// 音声一覧はページ読み込み直後は空のことがあり、後からvoiceschangedで届く。
// その場合に備えて、結果が表示済みなら再描画してボタンの表示を更新する。
if (speechSynth) {
  speechSynth.onvoiceschanged = () => {
    if (lastResult) {
      renderResultTable(lastResult);
    }
  };
}
