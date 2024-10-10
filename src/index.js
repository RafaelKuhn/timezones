
import { ZONE } from "./countries.js";
import { svgJsRoot,countryColor, initSvgEvents, resizeSvg,     fillWholeMap, prod, mouseEnterOcean, debugMode, enterSelectModeWithZone, colorTimezones, mouseClickZone, mouseClickOcean }
from "./svg.js";
//  from "/src/svg.js";

import { assignIds, svgsByZone, registeredSvgsSet, colorsByZone } from "/src/countries.js";


resizeSvg();



// DELETE WEIRD AREA AROUND INDIAN ISLANDS
document.getElementById("path60").remove();



/** @type {Array.<SVGPathElement>} */
const paths = svgJsRoot.querySelectorAll("path");
if (debugMode) console.log(`found ${paths.length} paths`);


const WATER_COLOR     = "rgb(236, 236, 236)";
const NEW_WATER_COLOR = "rgb(198, 236, 255)";

const pathAmountByMapColor = new Map();

const fixPathsAndPruneUnregisteredOnes = () => {
	for (const path of paths) {

		const num = pathAmountByMapColor.get(path.style.fill);
		if (!num) {
			pathAmountByMapColor.set(path.style.fill, 1)
		} else {
			pathAmountByMapColor.set(path.style.fill, num + 1)
		}
	
		// FIX WATER COLOR TO A BLUEYSH
		if (path.style.fill === countryColor) {
	
			// REMOVE NON MARKED COUNTRIES
			const isCountry = !!path.getAttribute(ZONE);
			if (!isCountry) path.remove();
			
		} else if (path.style.fill === WATER_COLOR) {
			// path.classList.add("water")
	
			path.addEventListener("mouseenter", _ => mouseEnterOcean());
			path.addEventListener("click", _ => mouseClickOcean());

			path.style.fill = NEW_WATER_COLOR;
		} else {
			path.classList.add("no-svg-events");
		}

	}
}

// PAINT HEADER
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
		colorTimezones();
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
if (debugMode) {
	let it = 0;
	for (const entry of pathAmountByMapColor) {
		console.log(`${it}: %c ${entry[0]}: ${entry[1]}`, `color: ${entry[0]}`);
	
		it += 1;
	}
	console.log(" ");
}



// EXPORT
if (false) {
// if (true) {
	const svg = document.querySelector("svg");
	let aFileParts = [ svg.innerHTML ];
	// let oMyBlob = new Blob(aFileParts, { type : 'text/html;charset=utf8' }); // the blob
	let oMyBlob = new Blob(aFileParts, { type : 'text/plain;charset=utf8' }); // the blob
	window.open(URL.createObjectURL(oMyBlob));
}

window.addEventListener("resize", _ => resizeSvg());


assignIds();
fixPathsAndPruneUnregisteredOnes();
initSvgEvents();

if (!debugMode) colorTimezones();

// enterSelectModeWithZone("gmt-4");
