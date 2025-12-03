import React, { useState } from 'react';

function ImageRecognition() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const upload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('image', file);

    try {
      const res = await fetch('/api/recognize/', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Recognition service not available' });
    }
  };

  return (
    <div>
      <h4>Image Recognition (prototype)</h4>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload & Recognize</button>
      {result && (
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default ImageRecognition;
