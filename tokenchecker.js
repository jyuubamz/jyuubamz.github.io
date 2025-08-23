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
      const name = v3Data?.name ?? 'NIL';
      const traits = (v3Data?.attributes ?? []).map(a => `<div class="trait">${a.trait_type}: ${a.value}</div>`).join('');
      const front = v3Data?.image || '';

      resultEl.innerHTML = `
        <div class="card-container">
          <div class="card">
            <div class="card-face front">
              <img src="${front}" alt="Objekt">
              <div class="overlay">?</div>
            </div>
          </div>
        </div>
        <div class="info-boxes">
          <div class="box">Abstract: ${name}</div>
          <div class="box">Cosmo: <span class="status not-minted">Not Minted</span></div>
        </div>
        <div class="traits">${traits}</div>
        <p class="nil"></p>
      `;
      return;
    }

    const front = v1Data.objekt.frontImage;
    const back  = v1Data.objekt.backImage;
    const abscanName = v3Data.name || v1Data?.name || '—';
    const cosmoName  = v1Data.name || v3Data?.name || '—';
    const traits = (v1Data.attributes ?? []).map(a => `<div class="trait">${a.trait_type}: ${a.value}</div>`).join('');

    // Format ObjektNo with leading zeros
    function formatObjektNo(no) {
      if (!no) return '';
      return '' + String(no).padStart(6, '0');
    }

    const collectionNo = v1Data?.objekt?.collectionNo ?? '';
    const objektNoRaw = v1Data?.objekt?.objektNo ?? '';
    const objektNo = formatObjektNo(objektNoRaw);

    // use textColor from v1 JSON
    const textColor = v1Data?.objekt?.textColor ?? '#000000';

    const overlayTextFront = `
      <div class="overlay-border right" style="color:${textColor}">
        <div class="overlay-line numbers">
          <span class="collection-no">${collectionNo}</span>
          <span class="objekt-no">#${objektNo}</span>
        </div>
      </div>
    `;

    const overlayTextBack = `
      <div class="overlay-border left" style="color:${textColor}">
        <div class="overlay-line numbers">
          <span class="collection-no">${collectionNo}</span>
          <span class="objekt-no">#${objektNo}</span>
        </div>
      </div>
    `;

    resultEl.innerHTML = `
    <div class="card-container" onclick="this.querySelector('.card').classList.toggle('flipped')">
      <div class="card">
        <div class="card-face front">
          <img src="${front}" alt="Front">
          <div class="overlay-number">${overlayTextFront}</div>
        </div>
        <div class="card-face back">
          <img src="${back}" alt="Back">
          <div class="overlay-number">${overlayTextBack}</div>
        </div>
      </div>
    </div>
    <div class="info-boxes">
      <div class="box">Abstract: ${abscanName}</div>
      <div class="box">Cosmo: ${cosmoName} <span class="status minted">Minted</span></div>
    </div>
    <div class="traits">${traits}</div>
    <p class="nil"></p>
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
