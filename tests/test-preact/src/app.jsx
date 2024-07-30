import { useState, useEffect } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import viteLogo from "/vite.svg";
import "./app.css";

import Button from "./components/Button";

export function App() {
  const [disabled, setDisabled] = useState(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const disabledInterval = setInterval(() => {
      setDisabled((prevDisabled) => !prevDisabled);
    }, 5000);

    const modeInterval = setInterval(() => {
      setMode((prevMode) => (prevMode === null ? "active" : null));
    }, 1000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(disabledInterval);
      clearInterval(modeInterval);
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Vite + Preact</h1>
      <div class="card">
        <Button size="sm" height="40px" mode={mode} disabled={disabled} />
        <p>
          Edit <code>src/app.jsx</code> and save to test HMR
        </p>
      </div>
      <p>
        Check out{" "}
        <a
          href="https://preactjs.com/guide/v10/getting-started#create-a-vite-powered-preact-app"
          target="_blank"
        >
          create-preact
        </a>
        , the official Preact + Vite starter
      </p>
      <p class="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
    </>
  );
}
