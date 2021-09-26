let step = 0;

const messages = [
  "I love Nuru!♥",
  "Aku cinta kamu! Nuru!",
  "大好きだよ。Nuru!😊"
];
function secret() {
  const i = Math.floor(Math.random() * 3);
  const text = messages[i];
  const audio = new Audio("https://yoshikai.net/sounds/dodon.mp3");
  audio.play().then(function() {
    alert(text);
  });
  //window.location.href = "https://yoshikai.net/nuru";
}

window.onload = function() {
  document.getElementById("ch1").onclick = function() {
    if (step === 0) {
      step = 1;
    } else {
      step = 0;
    }
  }
  document.getElementById("ch2").onclick = function() {
    if (step === 1) {
      step = 2;
    } else {
      step = 0;
    }
  }
  document.getElementById("ch3").onclick = function() {
    if (step === 2) {
      secret();
    }
    step = 0;
  }
}
