
import { svgJsRoot, countryColor, initSvgEvents, resizeSvg,     fillWholeMap, prod } from "/src/svg.js";

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

for (const path of paths) {
	if (path.style.fill !== countryColor) path.classList.add("nocountry")
}



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
			console.log(`%c${zoneName}`, `color: ${col}`);
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
			if (!isRegistered) path.style.fill = "rgb(255, 127, 0)";
	
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


if (fillWholeMap) window.mark(true);