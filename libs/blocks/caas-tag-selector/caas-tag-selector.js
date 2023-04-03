import { html, render, useState, useEffect } from '../../deps/htm-preact.js';

function CaasTagSelector() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fetchData () {
      const tagUrl = 'https://www.adobe.com/chimera-api/tags';
      const tagResp = await fetch(tagUrl);
      if (!tagResp.ok) return {};
      const json = await tagResp.json();
      return json;
    };
    const data = fetchData();
    console.log('data', data);
    setTags(data);
  }, []);

  return html`
    <div>
      <h1 class="cts-heading">Caas Tag Selector</h1>
      <p>${tags[0]?.namespaces?.caas?.name}<p/>
    </div>
  `;
}

export default async function init(el) {
  render(html`<${CaasTagSelector} />`, el);
}
