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

function getSpecialStyle(artist, season, member, collection) {

    let style = { ...DEFAULT_STYLE };

    for (const rule of SPECIAL_STYLES) {

        if (rule.artist && rule.artist !== artist) continue;

        if (rule.season && rule.season !== season) continue;

        // Single member
        if (rule.member && rule.member !== member) continue;

        // Multiple members
        if (rule.members && !rule.members.includes(member)) continue;

        if (rule.collections && !rule.collections.includes(collection)) continue;

        style = {
            ...style,
            ...rule.style
        };
    }

    return style;
}

function createIdnttOverlay(member, season, collection, backgroundColor) {
  let borderClass = "overlay-border right";
  let borderStyle = `background-color:${backgroundColor}; color:${DEFAULT_STYLE.text}`;

  if (collection === "301Z" || collection === "302Z") {
    borderClass += " scoborder";
    borderStyle = `color:${DEFAULT_STYLE.text}`;
  } else if (collection === "401Z") {
    borderClass += " ucoborder";
    borderStyle = `color:#000000`;
  } else if (
    (season === "Summer25" && collection === "202A") ||
    (season === "Winter26" && collection === "201A") ||
    (season === "Summer26" && collection === "201A") ||
    (season === "Summer26" && collection === "402A")
  ) {
    borderClass += " omaborder";
    borderStyle = `color:${DEFAULT_STYLE.text}`;
  }

  return `
        <div class="${borderClass}" style="${borderStyle}">
            <span class="overlay-line member">${member}</span>

            <div class="overlay-line numbers">
                <span class="collection-no">${collection}</span>
            </div>

            <span
                class="overlay-line group idntt"
                style="--logo-color:${DEFAULT_STYLE.logo}">
            </span>
        </div>
    `;
}

function createTripleSOverlay(artist, member, season, collection) {

    const style = getSpecialStyle(
        artist,
        season,
        member,
        collection
    );

    return `
        <div class="overlay-border right" style="color:${style.text}">
            <div class="overlay-line numbers">
                <span class="collection-no">${collection}</span>
            </div>
        </div>
    `;
}

function createOverlay(attrs, data) {
  const backgroundColor = data.background_color ?? "#000000";

  if (attrs.Artist === "idntt") {
    return createIdnttOverlay(
        attrs.Member,
        attrs.Season,
        attrs.Collection,
        backgroundColor
    );
  }

  return createTripleSOverlay(attrs.Artist, attrs.Member, attrs.Season, attrs.Collection);
}

function renderCard(data) {
  const attrs = getAttributes(data);

  const overlay = createOverlay(attrs, data);

  resultEl.innerHTML = `
        <span class="ObjStatus">
            ${attrs.Season} ${attrs.Member} ${attrs.Collection}
        </span>
        <br>

        <span class="status minted">
            MINTED ON COSMO
        </span>

        <p class="nil"></p>

        <div class="card-container">

            <div class="card">

                <div class="card-face front">

                  <img
                      src="${data.image}"
                      alt="${attrs.Member}"
                  >

                  <div class="overlay-number">
                      ${overlay}
                  </div>

                </div>

            </div>

        </div>
    `;
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

      return;
    }

    renderCard(data);
  } catch (err) {
    console.error(err);

    resultEl.innerHTML = `<p class="error">Error loading Objekt.</p>`;
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
