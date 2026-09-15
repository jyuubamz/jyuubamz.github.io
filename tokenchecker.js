const resultEl = document.getElementById("result");
const searchInput = document.getElementById("searchInput");
async function fetchObjekt(id) {
  const url = `https://api.cosmo.fans/bff/v3/objekts/nft-metadata/${encodeURIComponent(id)}`;
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  return await response.json();
}
function getAttributes(data) {
  return Object.fromEntries(
    (data.attributes ?? []).map((attr) => [attr.trait_type, attr.value]),
  );
}
function renderCard(data) {
  const attrs = getAttributes(data);
  resultEl.innerHTML = ` <span class="ObjStatus"> ${attrs.Season} ${attrs.Member} ${attrs.Collection} </span> <br> <span class="status minted"> MINTED ON COSMO </span> <p class="nil"></p> <div class="card-container"> <div class="card"> <div class="card-face front"> <img src="${data.image}" alt="${attrs.Member}" > </div> </div> </div> `;
}
async function searchObjekt() {
  const id = searchInput.value.trim();
  if (!id) {
    return;
  }
  resultEl.innerHTML = `<p class="nil">Loading...</p>`;
  try {
    const data = await fetchObjekt(id);
    if (!data) {
      resultEl.innerHTML = `<p class="nil">Not minted</p>`;
      document.getElementById("openseaBtn").disabled = true;
      document.getElementById("abscanBtn").disabled = true;
      return;
    }
    renderCard(data);
    document.getElementById("openseaBtn").disabled = false;
    document.getElementById("abscanBtn").disabled = false;
  } catch (err) {
    console.error(err);
    resultEl.innerHTML = `<p class="error">Error loading Objekt.</p>`;
    document.getElementById("openseaBtn").disabled = true;
    document.getElementById("abscanBtn").disabled = true;
  }
}
function changeToken(delta) {
  const current = Number(searchInput.value) || 1;
  searchInput.value = Math.max(1, current + delta);
  searchObjekt();
}
[
  ["up1Btn", 1],
  ["up10Btn", 10],
  ["up100Btn", 100],
  ["down1Btn", -1],
  ["down10Btn", -10],
  ["down100Btn", -100],
].forEach(([id, delta]) => {
  document
    .getElementById(id)
    .addEventListener("click", () => changeToken(delta));
});
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchObjekt();
  }
});
searchInput.addEventListener("blur", () => {
  const value = Number(searchInput.value);
  if (!value || value < 1) {
    searchInput.value = 1;
  }
});
function openOpenSea() {
  const id = searchInput.value.trim();
  if (!id) return;
  window.open(
    `https://opensea.io/item/abstract/0x99bb83ae9bb0c0a6be865cacf67760947f91cb70/${encodeURIComponent(id)}?activityTypes=all`,
    "_blank",
  );
}
function openAbscan() {
  const id = searchInput.value.trim();
  if (!id) return;
  window.open(
    `https://abscan.org/token/0x99bb83ae9bb0c0a6be865cacf67760947f91cb70?a=${encodeURIComponent(id)}#transactions`,
    "_blank",
  );
}
document.getElementById("openseaBtn").addEventListener("click", openOpenSea);
document.getElementById("abscanBtn").addEventListener("click", openAbscan);
