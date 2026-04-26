import React, { useState, useEffect } from "react";
import { Code } from "lucide-react";

const App = () => {
  const [url, setUrl] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [history, setHistory] = useState([]);
  const [tests, setTests] = useState("");

  useEffect(() => {
    const local = localStorage.getItem("history");
    if (local) {
      setHistory(JSON.parse(local));
    } else {
      fetch("http://127.0.0.1:8000/history?limit=10")
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(() => {});
    }
  }, []);
  useEffect(() => {
  const ws = new WebSocket("ws://127.0.0.1:8000/ws");

  ws.onopen = () => console.log(" WebSocket Connected");

  // Inside your useEffect for WebSocket
ws.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);
    console.log("WS Received:", msg); // Check this in F12 console!

    if (msg.type === "API_RESPONSE") {
      setResponse({
        // Extract the actual JSON data from the nested 'data' key in your python response
        ...(msg.data.response.data || {}),

        // Handle your test results specifically
        tests: msg.data.response.tests,

        // Map the stats so the UI header lights up
        _stats: {
          status: msg.data.status_code,
          time: msg.data.response_time * 1000 // Convert to ms if python sends seconds
        },
        _meta: {
          url: msg.data.url,
          method: msg.data.method
        }
      });

      // Update History
      setHistory(prev => [msg.data, ...prev.slice(0, 9)]);
    }
  } catch (err) {
    console.error("WS Error:", err);
  }
};



  ws.onerror = () => console.log("❌ WebSocket error");

  return () => ws.close();
}, []);

  const sendRequest = async () => {
    setLoading(true);

    const formattedHeaders = {};
    headers.forEach(h => {
      if (h.key) formattedHeaders[h.key] = h.value;
    });

    const finalUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

    const start = Date.now();

    try {
      const res = await fetch("http://127.0.0.1:8000/request/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: finalUrl,
          method,
          headers: formattedHeaders,
          body: body ? JSON.parse(body) : {},
          tests: tests ? JSON.parse(tests) : null
        }),
      });

      const data = await res.json();
      const time = Date.now() - start;

      setResponse({
        ...data,
        _stats: { time, status: res.status }
      });

      const newHistory = [{ url, method }, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem("history", JSON.stringify(newHistory));

    } catch {
      setResponse({ error: "Request failed" });
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">

      {/* 🔹 Sidebar */}
      <div className="w-64 bg-[#020617] border-r border-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4 text-blue-400">⚡ API Inspector</h2>

        <button
          onClick={() => {
            setHistory([]);
            localStorage.removeItem("history");
          }}
          className="text-xs text-red-400 mb-3"
        >
          Clear History
        </button>

        <div className="space-y-2 text-sm">
          {history.map((h, i) => (
            <div
              key={i}
              onClick={() => {
                setUrl(h.url);
                setMethod(h.method);
              }}
              className="cursor-pointer p-2 rounded hover:bg-gray-800"
            >
              <span className="text-blue-400">{h.method}</span> {h.url}
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Main Panel */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded text-blue-400 font-bold"
          >
            {["GET", "POST", "PUT", "DELETE"].map(m => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <input
            placeholder="Base URL"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded w-64"
          />

          <input
            placeholder="/endpoint or full URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 px-3 py-2 rounded"
          />

          <button
            onClick={sendRequest}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded font-semibold"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 text-sm">
          <div className="px-4 py-2 border-b-2 border-blue-500 text-blue-400">Body</div>
          <div className="px-4 py-2">Headers</div>
          <div className="px-4 py-2">Tests</div>
        </div>

        {/* Body Editor */}
        <div className="p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-40 bg-black text-green-400 font-mono p-3 rounded border border-gray-700"
            placeholder='{ "name": "John" }'
          />

          {/* Headers */}
          <div className="mt-4">
           <h3 className="mb-2 text-gray-400">
  Response

  {response?._meta && (
    <div className="text-xs text-gray-500 mt-1">
      {response._meta.method} → {response._meta.url}
    </div>
  )}

  {response?._stats && (
    <span
      className={`ml-2 ${
        response._stats.status < 400
          ? "text-green-400"
          : "text-red-400"
      }`}
    >
      {response._stats.status} • {Math.round(response._stats.time)}ms
    </span>
  )}
</h3>
            {headers.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  placeholder="Key"
                  value={h.key}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[i].key = e.target.value;
                    setHeaders(newHeaders);
                  }}
                  className="bg-gray-900 border border-gray-700 px-2 py-1 rounded"
                />
                <input
                  placeholder="Value"
                  value={h.value}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[i].value = e.target.value;
                    setHeaders(newHeaders);
                  }}
                  className="bg-gray-900 border border-gray-700 px-2 py-1 rounded"
                />
              </div>
            ))}
          </div>

          {/* Tests */}
          <div className="mt-4">
            <h3 className="text-sm mb-2 text-gray-400">Tests</h3>
            <textarea
              value={tests}
              onChange={(e) => setTests(e.target.value)}
              className="w-full h-24 bg-black text-yellow-400 p-2 rounded border border-gray-700"
              placeholder={`{ "status_code": 200 }`}
            />
          </div>
        </div>

        {/* Response */}
        <div className="flex-1 border-t border-gray-800 p-4 overflow-auto">
          <h3 className="mb-2 text-gray-400">
            Response{" "}
            {response?._stats && (
              <span
                className={`ml-2 ${
                  response._stats.status < 400
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {response._stats.status} • {response._stats.time}ms
              </span>
            )}
          </h3>

          {response ? (
            <pre className="bg-black text-green-400 p-4 rounded text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-500 flex items-center gap-2">
              <Code /> No response yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;