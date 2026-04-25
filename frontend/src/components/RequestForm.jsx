import { useState } from "react";
import axios from "axios";

function RequestForm() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("{}");
  const [response, setResponse] = useState(null);

  const sendRequest = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/request/send", {
        method,
        url,
        headers: {},
        params: {},
        body: method === "GET" ? null : JSON.parse(body),
        tests: {
          status_code: 200
        }
      });

      setResponse(res.data);
    } catch (err) {
      setResponse({ error: "Request failed" });
    }
  };

  return (
    <div>
      {/* Method + URL */}
      <div style={{ display: "flex", gap: "10px" }}>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <input
          style={{ flex: 1 }}
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <br />

      {/* Body */}
      {method !== "GET" && (
        <textarea
          rows="5"
          style={{ width: "100%" }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}

      <br />

      <button onClick={sendRequest}>Send 🚀</button>

      <br /><br />

      {/* Response */}
      {response && (
        <pre style={{ background: "#f4f4f4", padding: "10px" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default RequestForm;