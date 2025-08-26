const notifications = () => {
  const notifBtn = document.querySelector(".notify-me");
  notifBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let myNotification = null;

    const options = {
      body: "Texte de la notif",
      icon: "icons/favicon-16x16.png",
      url: "https://cepegra.be",
      vibrate: [200, 100, 200],
    };
    if (!("Notification" in window)) {
      alert("Ce navigateur ne supporte pas les notifications");
    } else if (Notification.permission === "granted") {
      console.log("Notification permission already granted");
      myNotification = new Notification("Hello", options);
    } else {
      Notification.requestPermission().then((result) => {
        if (result === "granted") {
          console.log("Notification permission granted");
          myNotification = new Notification("Hello", options);
        }
      });
    }
    myNotification.onclick = (e) => {
      e.preventDefault();
      window.open("https://cepegra.be", "_blank");
    };
    myNotification = null;
  });
};

notifications();
