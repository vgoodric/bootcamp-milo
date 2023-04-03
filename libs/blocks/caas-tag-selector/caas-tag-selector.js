import { html, render, useState, useEffect } from '../../deps/htm-preact.js';

function processTags(tagData, tagArr = []) {
  let tagA = tagArr.length > 0 ? tagArr : [];

  Object.entries(tagData).forEach((k) => {
    tagA.push(k[1].tagID);
    if (k[1].tags && Object.keys(k[1].tags).length > 0) {
      processTags(k[1].tags, tagA);
    }
  });

  return tagA;
}

function TagOptionSelector({ tags }) {
  return html`
    <select class='tag-options' value=''>
      ${tags.map((tag) => html`<option>${tag}</option>`)}
    </select>
  `;
}

function TagPreview({ selectedTags }) {
  function handleClick() {
    const tagString = selectedTags.reduce((rdx, tag, i, arr) => {
      if (i === arr.length - 1) {
        rdx += tag;
      } else {
        rdx += `${tag},`;
      }
      return rdx;
    }, '');
    navigator.clipboard.writeText(tagString);
  }

  return html`
    <div class='tag-preview-container'>
      <p class='tag-preview'>
        ${selectedTags.map((tag) => html`<span>${tag},</span>`)}
      </p>
      <button onClick=${() => handleClick()}>Copy to clipboard</button>
    </div>
  `;
}

function AddTag({ currentTags, setTag }) {
  function handleAddTag() {
    const selected = document.querySelector('.tag-options').value;
    setTag([...currentTags, selected]);
  }

  return html`<button onClick=${() => handleAddTag()}>Add this tag</button>`;
}

function CaasTagSelector() {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(async () => {
    async function fetchData() {
      const tagUrl = 'https://www.adobe.com/chimera-api/tags';
      const tagResp = await fetch(tagUrl);
      if (!tagResp.ok) return {};
      const json = await tagResp.json();
      return json;
    }
    const data = await fetchData();
    console.log('data', data);
    const allTags = processTags(data.namespaces.caas.tags);
    setTags(allTags);
  }, []);

  return html`
    <h1 class="cts-heading">Caas Tag Selector data</h1>
    <${TagPreview} selectedTags=${selectedTags}/>
    <${TagOptionSelector} tags=${tags} />
    <${AddTag} currentTags=${selectedTags} setTag=${setSelectedTags}/>
  `;
}

export default async function init(el) {
  render(html`<${CaasTagSelector} />`, el);
}
