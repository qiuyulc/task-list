// import { StrictMode } from "react"; 
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/redux/store";
import RouterView from "@/router";
import "@/utils/resize";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <Provider store={store}>
      <HashRouter basename={"/task-list/"}>
        <RouterView />
      </HashRouter>
    </Provider>
  // </StrictMode>
);
