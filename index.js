let step = 0;

function secret() {
  const i = Math.floor(Math.random() * 3);
  let text = "You are ";
  for (let j = 0; j <= i; j++) {
    text += "SUPER ";
  }
  text += "LUCKY!!!";
  alert(text);
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
