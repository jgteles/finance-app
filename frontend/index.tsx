import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LoginProvider } from "./src/context/LoginContext.tsx";
import { RegisterProvider } from "./src/context/RegisterContext.tsx";
import { TransactionsProvider } from "./src/context/TransactionsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoginProvider>
      <RegisterProvider>
        <TransactionsProvider>
          <App />
        </TransactionsProvider>
      </RegisterProvider>
    </LoginProvider>
  </React.StrictMode>
);
