import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LoginProvider } from "./src/context/LoginContext.tsx";
import { RegisterProvider } from "./src/context/RegisterContext.tsx";
import { TransactionsProvider } from "./src/context/TransactionsContext.tsx";
import { PiggyBanksProvider } from "./src/context/PiggyBanksContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoginProvider>
      <RegisterProvider>
        <PiggyBanksProvider>
          <TransactionsProvider>
            <App />
          </TransactionsProvider>
        </PiggyBanksProvider>
      </RegisterProvider>
    </LoginProvider>
  </React.StrictMode>
);
