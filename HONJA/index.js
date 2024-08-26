
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
const languageCodes = {"Hiragana":"ja", "Romaji":"en", "Thai":"th", "Korean":"ko", "Arabic":"ar", "Russian":"ru", "Greek":"el", "Hindi":"hi", "Tamil":"ta"};


const Transliterator = window.Transliterator;
const honja = new Transliterator();

function createGoogleTranslateUrl(lang, result){
  if (lang in languageCodes) {
    return "https://translate.google.co.jp/m/translate#" + languageCodes[lang] + "/ja/" + result;
  }
  return "https://translate.google.co.jp/m/translate#auto/ja/" + result;
}
function tryHonja() {
  let text = document.getElementById("input-text").value.replaceAll("<", "").replaceAll(">", "").replaceAll("'", "").replaceAll("\"", "").replaceAll("&");
  if (text.trim() === "") {
    text = "ひらがなかカタカナをいれてください";
    document.getElementById("input-text").value = text; 
  }
  let result = honja.convertAll(text);
  console.info(result);
  let table = ``;
  table += "<thead><tr><th>言語</th><th>結果</th></tr></thead>";
  table += "<tbody>" + languages.map(language => {
    return `<tr><td nowrap>${languageNameList[language]}</td><td><a href="${createGoogleTranslateUrl(language, result[language])}" target="_blank">${result[language]}</a></td></tr>`
  }).reduce((a, b) => a + b, "") + "</tbody>";

  document.getElementById("honja-result").innerHTML = table;
  document.getElementById("source").innerHTML = '<a href="https://github.com/TakutoYoshikai/honja">Source Code 👉 TakutoYoshikai/honja</a>';

}
