// import install from "./install.js";
const fetchApi = async () => {
  try {
    const response = await fetch(
      "https://ingrwf12.cepegra-frontend.xyz/cockpit1/api/content/items/voyages"
    );
    const data = await response.json();
    document.querySelector(".voyage").textContent = data[0]["voyages-label"];
    document.querySelector(".description").innerHTML =
      data[0]["voyages-description"];
    document
      .querySelector(".prix")
      .insertAdjacentText("afterbegin", `${data[0]["voyages-prix"]} `);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchApi();
// install();
