
import { draw, prod,     initSvg as initSvgEvents, resizeSvg } from "/src/svg.js";

import { assignIds } from "./countries.js";


const resize = () => {
	resizeSvg();
}

resize();
assignIds();

initSvgEvents();




/** @type {Array.<SVGPathElement>} */
const paths = draw.node.querySelectorAll("path");
console.log(`found ${paths.length} paths`);



const map = new Map();
for (const path of paths) {
	const fill = path.style.fill;

	const num = map.get(fill);
	if (!num) {
		map.set(fill, 1)
	} else {
		map.set(fill, num + 1)
	}
}





// LOG
var it = 0;
for (const entry of map) {
	console.log(`${it}: %c ${entry[0]}: ${entry[1]}`, `color: ${entry[0]}`);

	it += 1;
}
console.log(" ");




if (false) {
// if (true) {
	const svg = document.querySelector("svg");
	var aFileParts = [ svg.innerHTML ];
	// var oMyBlob = new Blob(aFileParts, { type : 'text/html;charset=utf8' }); // the blob
	var oMyBlob = new Blob(aFileParts, { type : 'text/plain;charset=utf8' }); // the blob
	window.open(URL.createObjectURL(oMyBlob));
}



window.addEventListener("resize", _ => {
	resize();
});

 