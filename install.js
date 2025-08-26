const installBtn = document.querySelector(".install-btn");
let deferredPrompt = null;

installBtn.classList.add("hidden");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", (e) => {
  e.preventDefault();
  installBtn.classList.add("hidden");
  deferredPrompt.prompt();
});
