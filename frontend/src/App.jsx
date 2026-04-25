import React, { useState } from "react";
import { Send, History, Settings, Code, Shield } from "lucide-react";

const App = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Suggested Feature: History State
  const [history, setHistory] = useState([]);

  const sendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const res = await fetch("http://127.0.0.1:8000/request/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          method,
          headers: {},
          body: body ? JSON.parse(body) : {},
        }),
      });
      const data = await res.json();
      const duration = Date.now() - startTime;
      setResponse({ ...data, _stats: { time: duration, status: res.status } });
    } catch (err) {
      setResponse({ error: "Check if backend is running at :8000" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <nav className="border-b bg-white px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Shield size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">API Inspector <span className="text-indigo-600 text-xs bg-indigo-50 px-2 py-1 rounded ml-2">v1.0</span></h1>
        </div>
        <div className="flex gap-4 text-slate-500">
          <History size={20} className="cursor-pointer hover:text-indigo-600" />
          <Settings size={20} className="cursor-pointer hover:text-indigo-600" />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-12 gap-8">
        {/* Left Side: Request Builder */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex gap-3 mb-6">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="bg-slate-100 border-none rounded-lg px-4 py-3 font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500"
              >
                {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m}>{m}</option>)}
              </select>
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button
                onClick={sendRequest}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
              >
                {loading ? "..." : <><Send size={18} /> Send</>}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex border-b text-sm font-medium text-slate-500 gap-6 mb-4">
                <button className="border-b-2 border-indigo-600 text-indigo-600 pb-2">Body</button>
                <button className="pb-2 hover:text-slate-800">Headers</button>
                <button className="pb-2 hover:text-slate-800">Auth</button>
              </div>

              <textarea
                placeholder='{ "name": "John Doe" }'
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-48 p-4 bg-slate-900 text-emerald-400 font-mono text-sm rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Response View */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">Response</h3>
              {response?._stats && (
                <div className="flex gap-3 text-xs">
                  <span className="text-emerald-600 font-bold">{response._stats.status} OK</span>
                  <span className="text-slate-400">{response._stats.time}ms</span>
                </div>
              )}
            </div>
            <div className="flex-1 p-0 overflow-hidden rounded-b-xl">
              {response ? (
                <pre className="h-full overflow-auto bg-slate-950 text-slate-300 p-6 text-sm font-mono leading-relaxed">
                  {JSON.stringify(response, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 opacity-60">
                  <Code size={40} />
                  <p>Ready to inspect API</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
