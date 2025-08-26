const install = () => {
  const installBtn = document.querySelector(".install-btn");
  let deferredPrompt = null;

  installBtn.classList.add("hidden");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove("hidden");
  });

  installBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    deferredPrompt.prompt();
    const userChoice = await deferredPrompt.userChoice;
    if (userChoice == "accepted") {
      installBtn.classList.add("hidden");
    }
    deferredPrompt = null;
  });

  window.addEventListener("appinstalled", () => {
    installBtn.classList.add("hidden");
  });
};

install();

// export default install;
