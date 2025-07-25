import { useState, useRef, useEffect, useCallback } from "react";
import { client } from "../../appwrite/client";
import { AppwriteException } from "appwrite";

function App() {
  const [detailHeight, setDetailHeight] = useState(55);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showLogs, setShowLogs] = useState(false);
  const detailsRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (detailsRef.current) {
      setDetailHeight(detailsRef.current.clientHeight);
    }
  }, [logs, showLogs]);

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [updateHeight]);

  useEffect(() => {
    if (!detailsRef.current) return;
    detailsRef.current.addEventListener("toggle", updateHeight);
    return () => {
      if (!detailsRef.current) return;
      detailsRef.current.removeEventListener("toggle", updateHeight);
    };
  }, []);

  async function sendPing() {
    if (status === "loading") return;
    setStatus("loading");
    try {
      const result = await client.ping();
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: 200,
        response: JSON.stringify(result),
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("success");
    } catch (err) {
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: err instanceof AppwriteException ? err.code : 500,
        response:
          err instanceof AppwriteException
            ? err.message
            : "Something went wrong",
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("error");
    }
    setShowLogs(true);
  }

  return (
    <main>
      <section>
        <h1>Travel App Status</h1>

        <p>
          {status === "success"
            ? "You connected your app successfully."
            : "Send a ping to verify the connection"}
        </p>

        <button onClick={sendPing} disabled={status === "loading"}>
          Send a ping
        </button>

        {status === "loading" && <p>Waiting for connection...</p>}
        {status === "success" && <p>Connected</p>}
        {status === "error" && <p>Connection failed</p>}
      </section>

      <aside>
        <details open={showLogs} ref={detailsRef}>
          <summary>
            <span>Logs</span> {logs.length > 0 && <span>{logs.length}</span>}
          </summary>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Method</th>
                <th>Path</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <tr key={i}>
                    <td>
                      {log.date.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{log.status}</td>
                    <td>{log.method}</td>
                    <td>{log.path}</td>
                    <td>{log.response}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>There are no logs to show</td>
                </tr>
              )}
            </tbody>
          </table>
        </details>
      </aside>
    </main>
  );
}

export default App;