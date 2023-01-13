import { html, createContext, useState } from '../../../deps/htm-preact.js';

export const UploadFileContext = createContext();

function useUploadData() {
  const [uploadedData, setUploadedData] = useState();
  const [uploadedFileName, setUploadedFileName] = useState();
  const uploadFileOnChange = async (e) => {
    const fileInput = e.target.files?.[0];
    if (fileInput) {
      const content = await fileInput.text();
      const parsed = JSON.parse(content);
      setUploadedData(parsed);
      setUploadedFileName(fileInput.name);
    } else {
      setUploadedData(null);
      setUploadedFileName(null);
    }
  };
  return { uploadedData, uploadFileOnChange, uploadedFileName };
}

function UploadFileWrapper({ children }) {
  const { uploadedData, uploadFileOnChange, uploadedFileName } =
    useUploadData();
  return html`
    <${UploadFileContext.Provider}
      value=${{ uploadedData, uploadedFileName }}
    >
      <div class="mb2">
        <input
          type="file"
          name="persistedResults"
          accept=".json"
          onchange=${uploadFileOnChange}
        />
      </div>
      ${children}
    <//>
  `;
}

export default UploadFileWrapper;
