function myMessage(text) {
  return `<div class="message">
    <img src="images/takuto-meshi.png" class="message-icon">
    <div class="message-text">${text}</div>
  </div>`
}

function yourMessage(text) {
  return `<div class="my-message">
    <div class="message-text">${text}</div>
    <img src="images/yuta.jpg" class="message-icon">
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
  return title("趣味について") + messages.reduce(function(a, b) {
    if (b.my) {
      return a + myMessage(b.text);
    }
    return a + yourMessage(b.text);
  }, "")
}
document.getElementById("chat").innerHTML = chat([
  {
    my: true,
    text: "ゆたぴー元気？"
  },
  {
    my: false,
    text: "元気だよーたくと君は？"
  },
  {
    my: true,
    text: "元気だよ"
  },

])
