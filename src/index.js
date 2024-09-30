
import { ZONE } from "./countries.js";
import { svgJsRoot,countryColor, initSvgEvents, resizeSvg,     fillWholeMap, prod, mouseEnterOcean, debugMode }
from "./svg.js";
//  from "/src/svg.js";

import { assignIds, svgsByZone, registeredSvgsSet, colorsByZone } from "/src/countries.js";


const resize = () => {
	resizeSvg();
}

resize();
assignIds();

initSvgEvents();


// DELETE WEIRD AREA AROUND INDIAN ISLANDS
document.getElementById("path60").remove();





/** @type {Array.<SVGPathElement>} */
const paths = svgJsRoot.node.querySelectorAll("path");
console.log(`found ${paths.length} paths`);


const waterColor    = "rgb(236, 236, 236)";
const newWaterColor = "rgb(198, 236, 255)";

const map = new Map();
for (const path of paths) {

	const num = map.get(path.style.fill);
	if (!num) {
		map.set(path.style.fill, 1)
	} else {
		map.set(path.style.fill, num + 1)
	}

	// FIX WATER COLOR TO A BLUEYSH
	if (path.style.fill === countryColor) {

		// REMOVE NON MARKED COUNTRIES
		const isCountry = !!path.getAttribute(ZONE);
		if (!isCountry) path.remove();
		
	} else if (path.style.fill === waterColor) {
		// path.classList.add("water")

		path.addEventListener("mouseenter", evt => mouseEnterOcean(evt.target));
		path.style.fill = newWaterColor;
	} else {
		path.classList.add("no-svg-events");
	}

}

document.getElementById("path15774").style.fill = "beige";
document.getElementById("path15775").style.fill = "black";




// DEBUG
window.prune = pruneRegistered => {
	for (const path of paths) {
		const isCountry = path.style.fill === countryColor;
		if (!isCountry) continue;

		const isRegistered = registeredSvgsSet.has(path);
		if (pruneRegistered) {
			if (isRegistered) path.remove()
		} else {
			if (!isRegistered) path.remove()
		}

	}
}

window.mark = markRegistered => {
	if (markRegistered) {

		// let it = 0;
		const cols = 4;
		for (const [ zoneName, paths ] of svgsByZone) {

			const col = colorsByZone.get(zoneName);
			// console.log(`%c${zoneName}`, `color: ${col}`);
			for (const path of paths) {
				path.style.fill = col;				
			}
			
			it += 1;
		}

	} else {
	
		for (const path of paths) {
			const isCountry = path.style.fill === countryColor;
			if (!isCountry) continue;

			const isRegistered = registeredSvgsSet.has(path);
			if (!isRegistered) path.style.fill = "rgb(255, 0, 0)";

		}

	}
}






// LOG
var it = 0;
for (const entry of map) {
	console.log(`${it}: %c ${entry[0]}: ${entry[1]}`, `color: ${entry[0]}`);

	it += 1;
}
console.log(" ");



// EXPORT
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


if (!debugMode)
	window.mark(true);
