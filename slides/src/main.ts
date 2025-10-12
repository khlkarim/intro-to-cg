import Reveal from "reveal.js";
import Notes from "reveal.js/plugin/notes/notes.esm.js";
import KaTeX from "reveal.js/plugin/math/math.esm.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import Highlight from "reveal.js/plugin/highlight/highlight.esm.js";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/blood.css";
import "reveal.js/plugin/highlight/zenburn.css";
import initCanvases from "./canvases/init";

let deck = new Reveal({
    hash: true,
    plugins: [Markdown, Highlight, Notes, KaTeX],
});

deck.initialize({
    width: "100%",
    height: "100%",
    margin: 0,        
    minScale: 1,
    maxScale: 1,
    slideNumber: true,
    autoPlayMedia: true
});

document.addEventListener("DOMContentLoaded", () => {
    initCanvases();
});

const cameraIFrame = document.querySelector("#camera-params-iframe");
cameraIFrame?.setAttribute("src", "https://webglfundamentals.org/webgl/frustum-diagram.html");
cameraIFrame?.setAttribute("width", "400");
cameraIFrame?.setAttribute("height", "550");