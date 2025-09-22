function serialFromV1(v1){
  return String(
    v1?.objekt?.objektNo ??
    v1?.objekt?.tokenId ??
    (v1?.name?.match(/#(\d+)/)?.[1] ?? '')
  ).replace(/^#/, '');
}

async function searchObjekt() {
  const id = document.getElementById('searchInput').value.trim();
  if (!id) return;

  const v1Url = `https://api.cosmo.fans/objekt/v1/token/${encodeURIComponent(id)}`;
  const v3Url = `https://api.cosmo.fans/bff/v3/objekts/nft-metadata/${encodeURIComponent(id)}`;
  const resultEl = document.getElementById('result');

  resultEl.innerHTML = `<p class="nil">Loading…</p>`;

  let v1Data = null, v3Data = null;
  const [v1Res, v3Res] = await Promise.allSettled([fetch(v1Url), fetch(v3Url)]);
  if (v1Res.status === 'fulfilled' && v1Res.value.ok) v1Data = await v1Res.value.json().catch(()=>null);
  if (v3Res.status === 'fulfilled' && v3Res.value.ok) v3Data = await v3Res.value.json().catch(()=>null);

  const minted = Boolean(v1Data?.objekt?.backImage);

  try {
    if (!minted) {
      const seasonv3 = v3Data?.attributes?.find(a => a.trait_type === "Season")?.value ?? '';
      const memberNamev3 = v3Data?.attributes?.find(a => a.trait_type === "Member")?.value ?? '';
      const collectionNov3 = (v3Data?.attributes || []).find(a => a.trait_type === "Collection")?.value ?? '';
      const front = v3Data?.image || 'placeholder.png';

      resultEl.innerHTML = `
        <span class="ObjStatus">${seasonv3} ${memberNamev3} ${collectionNov3}</span> #??????<br>
        <span class="status not-minted">NOT MINTED ON COSMO</span>
        <p class="nil"></p>
        <div class="card-container">
          <div class="card">
            <div class="card-face front">
              <img src="${front}" alt="Objekt">
            </div>
          </div>
        </div>
      `;
      return;
    }

    const front = v1Data.objekt.frontImage;
    const back  = v1Data.objekt.backImage;

    // Format ObjektNo with leading zeros
    function formatObjektNo(no) {
      if (!no) return '';
      return '#' + String(no).padStart(6, '0');
    }

    const collectionNo = v1Data?.objekt?.collectionNo ?? '';
    const objektNoRaw = v1Data?.objekt?.objektNo ?? '';
    const memberName = v1Data?.objekt?.member ?? '';  // adjust if API has member
    const season = v1Data?.objekt?.season ?? '';

    const artist = (v1Data?.attributes || []).find(a => a.trait_type === "Artist")?.value ?? '';
    const objektNo = formatObjektNo(objektNoRaw);

    // use textColor from v1 JSON
    const textColor = v1Data?.objekt?.textColor ?? '#000000';
    const borderColor = v1Data?.objekt?.backgroundColor ?? '#000000';

    let borderClass = "overlay-border right"; // default
    let borderStyle = `color:${textColor}`; // default

    if (artist === "idntt") {
      // Special cases
      if (collectionNo === "301Z" || collectionNo === "302Z") {
        borderClass += " scoborder";
      } else if (collectionNo === "401Z") {
        borderClass += " ucoborder";
      } else if (collectionNo === "202A") {
        borderClass += " omaborder";  
      } else {
        // default border color only if not special
        borderStyle = `background-color:${borderColor}; color:${textColor}`;
      }
        
      overlayTextFront = `
        <div class="${borderClass}" style="${borderStyle}">
          <span class="overlay-line member">${memberName}</span>
          <div class="overlay-line numbers">
            <span class="collection-no">${collectionNo}</span>
            <span class="objekt-no">${objektNo}</span>
          </div>
          <span class="overlay-line group">${artist}</span>
        </div>
      `;

      overlayTextBack = `
        <div class="overlay-border left" style="color:${textColor}">
          <div class="overlay-line numbers">
            <span class="collection-no">${collectionNo}</span>
            <span class="objekt-no">${objektNo}</span>
          </div>
        </div>
      `;
    } else if (artist === "tripleS" || artist === "artms") {
      // Special cases
      if (memberName === "SeoYeon" && season === "Ever01" && collectionNo === "338Z") {
        sssborderStyle = `color:#07328d`;
      } else if (memberName === "HeeJin" && season === "Atom01" && collectionNo === "324Z" || collectionNo === "325Z") {
        sssborderStyle = `color:#FFFFFF`;
      } else {
        // default border color only if not special
        sssborderStyle = `color:${textColor}`;
      }

      // Minimal overlay (just numbers)
      overlayTextFront = `
        <div class="overlay-border right" style="${sssborderStyle}">
          <div class="overlay-line numbers">
            <span class="collection-no">${collectionNo}</span>
            <span class="objekt-no">${objektNo}</span>
          </div>
        </div>
      `;

      overlayTextBack = `
        <div class="overlay-border left" style="${sssborderStyle}">
          <div class="overlay-line numbers">
            <span class="collection-no">${collectionNo}</span>
            <span class="objekt-no">${objektNo}</span>
          </div>
        </div>
      `;
    }

    resultEl.innerHTML = `
    <span class="ObjStatus">${season} ${memberName} ${collectionNo}</span> #${objektNoRaw}<br>
    <span class="status minted">MINTED ON COSMO</span></div>
    <p class="nil"></p>
    <div class="card-container" onclick="this.querySelector('.card').classList.toggle('flipped')">
      <div class="card">
        <div class="card-face front">
          <img src="${front}" alt="Front">
          <div class="overlay-number">${overlayTextFront}</div>
        </div>
        <div class="card-face back">
          <img src="${back}" alt="Back">
          <div class="overlay-number">${overlayTextBack}</div>
          <img src="qrcode.png" alt="QR Code" class="qr-overlay">
        </div>
      </div>
    </div>
    `;
  } catch (err) {
    console.error(err);
    resultEl.innerHTML = `<p class="error">Error rendering data.</p>`;
  }
}

// --- Up & Down buttons ---
document.getElementById('upBtn').addEventListener('click', () => {
  let input = document.getElementById('searchInput');
  let current = parseInt(input.value) || 0; // default to 1 if empty/NaN
  input.value = current + 1;
  searchObjekt();
});

document.getElementById('downBtn').addEventListener('click', () => {
  let input = document.getElementById('searchInput');
  let current = parseInt(input.value) || 1;
  input.value = Math.max(1, current - 1); // never go below 1
  searchObjekt();
});

document.getElementById('searchInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') searchObjekt();
});

// Optional: clamp value manually on blur (if user types a smaller number)
document.getElementById('searchInput').addEventListener('blur', () => {
  let input = document.getElementById('searchInput');
  if (parseInt(input.value) < 1 || isNaN(input.value)) {
    input.value = 1;
  }
});
