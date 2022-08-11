window.onload = function () {
  document.getElementById("chloe").onclick = function () {
    document.getElementById("name").innerHTML = "I love my fiance Saung Zarchi Hnin. I vow eternal love.";
    document.getElementById("job").innerHTML = "";
  }
  let title = document.title;
  setInterval(() => {
    const now = new Date();
    if (now.getHours() == 16 && now.getMinutes() == 54) {
      document.title = "I love Saung💖 Marry me😍";
    } else {
      document.title = title;
    }
  }, 1000);
}
