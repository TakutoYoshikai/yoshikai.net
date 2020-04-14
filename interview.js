function myMessage(text) {
  return `<div class="message">
    <img src="images/takuto-meshi.png" class="message-icon">
    <div class="message-text">${text}</div>
  </div>`
}

function yourMessage(text) {
  return `<div class="my-message">
    <div class="message-text">${text}</div>
    <img src="images/takuto-meshi.png" class="message-icon">
  </div>`
}

function chat(messages) {
  return messages.reduce(function(a, b) {
    if (b.my) {
      return a + myMessage(b.text);
    }
    return a + yourMessage(b.text);
  }, "")
}
document.getElementById("chat").innerHTML = chat([
  {
    my: true,
    text: "Hello"
  },
  {
    my: false,
    text: "Hey"
  },

])
