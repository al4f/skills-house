import { renderToString } from "react-dom/server";
import { HelmetProvider, HelmetData } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { App } from "./App";

export function render(url: string): { html: string; head: string } {
  const helmetData = new HelmetData({});

  const html = renderToString(
    <HelmetProvider context={helmetData.context}>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  );

  const { helmet } = helmetData.context;
  const head = helmet
    ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
    : "";

  return { html, head };
}
