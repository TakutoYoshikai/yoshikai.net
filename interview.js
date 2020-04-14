function myMessage(text) {
  return `<div class="my-message">
    <div class="message-text">${text}</div>
    <img src="images/yuta.jpg" class="message-icon">
  </div>`
}

function yourMessage(text) {
  return `<div class="message">
    <img src="images/takuto-meshi.png" class="message-icon">
    <div class="message-text">${text}</div>
  </div>`
}

function title(text) {
  return `<div class="center">
    <p class="title">
      ${text}
    </p>
  </div>`
}

function chat(messages) {
  return messages.reduce(function(a, b) {
    if (b.type === "m") {
      return a + myMessage(b.text);
    } else if (b.type === "y") {
      return a + yourMessage(b.text);
    } else if (b.type === "t") {
      return a + title(b.text);
    }
  }, "")
}

function csvToChat(csv) {
  return csv.split("\n").map(function(msg) {
    if (msg === "") {
      return null;
    }
    return {
      type: msg[0],
      text: msg.slice(1)
    }
  }).filter(function(msg) {
    return msg !== null;
  })
}

function getChatTexts() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open("GET", "interview.csv", true);
    req.send(null);
    req.onload = function() {
      var text = req.responseText;
      resolve(text);
    }
  })
}

getChatTexts().then(function(text) {
  document.getElementById("chat").innerHTML = chat(csvToChat(text))
})
