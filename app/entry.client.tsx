/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});

// if the browser supports SW (all modern browsers do it)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", (event) => {
    console.log('Inside the load handler:', event);
    // we will register it after the page complete the load
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then((registration) => console.log('scope is: ', registration.scope));
  });
}
