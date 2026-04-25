import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);

  const sendRequest = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/request/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          method,
          headers: {},
          params: {},
          body: body ? JSON.parse(body) : {},
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: "Invalid request or server error" });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🚀 API Tester</h2>

      {/* URL */}
      <input
        type="text"
        placeholder="Enter API URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "60%", padding: "10px", marginRight: "10px" }}
      />

      {/* METHOD */}
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>

      {/* BODY */}
      <div style={{ marginTop: "10px" }}>
        <textarea
          placeholder='Enter JSON body {"key":"value"}'
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          style={{ width: "60%", padding: "10px" }}
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={sendRequest}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Send Request
      </button>

      {/* RESPONSE */}
      <div style={{ marginTop: "20px" }}>
        <h3>Response:</h3>
        <pre style={{ background: "#eee", padding: "10px" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;