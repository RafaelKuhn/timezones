
// Has UTC+05 timestamps
// import { svg } from "/src/svg_files/original_svg.js"

// Has no UTC+05 timestamps
// import { svg } from "/src/svg_files/new_svg.js"

// Has no countours
import { svg } from "/src/svg_files/newest_svg.js"

import { SVG } from "./svg.min.js"

import { ZONE, svgsByZone, colorsByZone, brightColorsByZone, timeIncrementByZone as timeIncrementHoursByZone, prettyZoneNamesByZone } from "./countries.js";
// from "/src/countries.js";


const gmtWindow = document.getElementById("fixbot");

/** @type {HTMLHeadingElement} */
const gmtHour = document.getElementById("gmt-hour");

/** @type {HTMLHeadingElement} */
// const gmtTextSvg = document.getElementById("gmt-parent");
const gmtText = document.getElementById("gmt");


/** @type {HTMLDivElement} */
const container = document.getElementById("container");

const svgJsRoot = SVG().addTo(container).svg(svg);

/** @type {HTMLElement & SVGSVGElement} */
// /** @type {HTMLElement & SVGElement} */
const mainSvg = svgJsRoot.node;



const fix = (v, n) => v.toFixed(n);
const fix2 = v => v.toFixed(2);
const fix0 = v => v.toFixed(0);

/** @type {{ x: Number, y: Number, wid: Number, hei: Number, scale: Number }} */
const attrFromVbox = vbox => `${fix(vbox.x, 2)} ${fix(vbox.y, 2)} ${fix(vbox.wid, 2)} ${fix(vbox.hei, 2)}`
/** @type {{ x: Number, y: Number, wid: Number, hei: Number, scale: Number }} */
const debugStrVbox = vbox => `[${fix(vbox.x, 0)}, ${fix(vbox.y, 0)}, ${fix(vbox.wid, 0)}, ${fix(vbox.hei, 0)}] sc ${vbox.scale}`


const firstInnerNode = svgJsRoot.node.firstChild;
const resizeFirstInnerNodeFromContainer = () => {
	firstInnerNode.setAttribute("width",  container.offsetWidth);
	firstInnerNode.setAttribute("height", container.offsetHeight);
}

const viewBox = { x: 0, y: 0, wid: mainSvg.clientWidth, hei: mainSvg.clientHeight, scale: 1.0 };
const originalSvgSize = { wid: mainSvg.clientWidth, hei: mainSvg.clientHeight };

const updateOriginalSvgSize = () => {
	originalSvgSize.wid = mainSvg.clientWidth;
	originalSvgSize.hei = mainSvg.clientHeight;
}

const updateSvgViewBoxAttribute = () => {
	mainSvg.setAttribute("viewBox", attrFromVbox(viewBox));
}


const initSvgEvents = () => {

	document.addEventListener("wheel", wheelEvt => {
	// svgVisibleArea.addEventListener("wheel", wheelEvt => {

		const ZOOM_SPEED = 0.05;
		const zoomAmount = Math.sign(-wheelEvt.deltaY) * ZOOM_SPEED;

		const dWid = viewBox.wid * zoomAmount;
		const dHei = viewBox.hei * zoomAmount;
		const dx = dWid * wheelEvt.offsetX / originalSvgSize.wid;
		const dy = dHei * wheelEvt.offsetY / originalSvgSize.hei;

		viewBox.wid -= dWid;
		viewBox.hei -= dHei;

		if (viewBox.wid > originalSvgSize.wid) viewBox.wid = originalSvgSize.wid;
		if (viewBox.hei > originalSvgSize.hei) viewBox.hei = originalSvgSize.hei;

		viewBox.scale = originalSvgSize.wid / viewBox.wid;

		const MAX_SCALE = 50;
		if (viewBox.scale > MAX_SCALE) {
			viewBox.scale = MAX_SCALE;

			viewBox.wid = originalSvgSize.wid / MAX_SCALE;
			viewBox.hei = originalSvgSize.hei / MAX_SCALE;
		} else {
			// only move if not going deeper than the zoom threshold
			viewBox.x += dx;
			viewBox.y += dy;
	
			if (viewBox.x < 0) viewBox.x = 0;
			if (viewBox.y < 0) viewBox.y = 0;
		}

		// console.log(`scale: ${viewBox.scale}, or ${fix2(viewBox.scale)}x`);
		clampViewBoxXyToScreen();
		updateSvgViewBoxAttribute();
	});


}


const resizeSvg = () => {

	container.width  = `${window.innerWidth}px`
	container.height = `${window.innerHeight}px`
	resizeFirstInnerNodeFromContainer();

	updateOriginalSvgSize();

	// this will reset the SVG zoom on resizing the screen
	viewBox.x = 0;
	viewBox.y = 0;
	viewBox.wid = mainSvg.clientWidth;
	viewBox.hei = mainSvg.clientHeight;

	updateSvgViewBoxAttribute();
}



updateOriginalSvgSize();
updateSvgViewBoxAttribute();




/** @type {SVGPathElement} */
let lastHoveredDbg = null;

/** @type {SVGPathElement} */
let currentHoveringDbg = null;




const splitUrl = document.location.toString().split("?");
console.assert(splitUrl.length >= 1, "should have an url");

export let debugMode = false;
let test = false;
let fillWholeMap = false;

if (splitUrl.length > 1) {
	const firstSplitByQuestionMark = splitUrl[1];
	if (firstSplitByQuestionMark.includes("debug")) debugMode = true;
	if (firstSplitByQuestionMark.includes("test"))  test = true;
	if (firstSplitByQuestionMark.includes("fill"))  fillWholeMap = true;
}

if (debugMode) console.log(`DEBUG MODE! test: ${test}`);

console.assert(!(debugMode && test), "shouldnt have both prod and debug mode")



const hasLastHovered = 
() => lastHoveredDbg !== null

const isHoveringNewShit =
nowHovering => {
	return nowHovering !== lastHoveredDbg;
}

const trySetLastHovered =
hoveredSmth => {
	currentHoveringDbg = hoveredSmth;

	if (hoveredSmth.style.fill !== countryColor) return;

	lastHoveredDbg = hoveredSmth;

	const gotAttr = hoveredSmth.getAttribute(ZONE);
	if (gotAttr) {
		hoveredSmth.style.fill = alreadyAccountedForHoveredColor;
	} else {
		hoveredSmth.style.fill = hoveredColor;
	}
}

const resetLastHovered =
() => {

	if (allClickedParts.includes(lastHoveredDbg)) return;

	lastHoveredDbg.style.fill = countryColor;
	lastHoveredDbg = null;
}



const raycastRect = mainSvg.createSVGRect();

/** @type {String} */
let currentHoveringZone = null;

const mouseEnterOcean = _ => {
	const hadZone = currentHoveringZone !== null;
	if (hadZone) {
		resetZoneHighlight(currentHoveringZone);
		currentHoveringZone = null;
	}

	gmtWindow.classList.remove("show");
	gmtWindow.classList.add("hide");
}

const resetZoneHighlight = zoneName => {
	const svgs = svgsByZone.get(zoneName);
	console.assert(!!svgs)

	for (const svg of svgs) {
		const color = colorsByZone.get(zoneName);
		svg.style.fill = color;
	}
}

const highlightZone = zoneName => {
	const brightColor = brightColorsByZone.get(zoneName);

	const date = getDateTimeOf(zoneName);
	gmtHour.innerText = `${date.getHours()}:${twoDigs(date.getMinutes())}`

	const color = colorsByZone.get(zoneName);
	gmtText.textContent = prettyZoneNamesByZone.get(zoneName);
	gmtText.style.fill = color;

	// gmtTextSvg.setAttribute("viewBox", `0 0 400 100`);


	const svgs = svgsByZone.get(zoneName);
	console.assert(!!svgs)
	for (const svg of svgs) {
		svg.style.fill = brightColor;
	}
}

const MINS_TO_MILLIS = 60 * 1000;
const getDateTimeOf = zoneName => {
	const date = new Date();
	const offset = date.getTimezoneOffset();

	date.setTime(date.getTime() + offset * MINS_TO_MILLIS);

	const minsIncrement = timeIncrementHoursByZone.get(zoneName) * 60;
	date.setTime(date.getTime() + minsIncrement * MINS_TO_MILLIS);

	return date;
}

const mouseEnterCountryPath = path => {
	// check if path is flagged as clicked

	// console.log(`entered path ${path}`);
	const timezoneAttrib = path.getAttribute(ZONE);
	console.assert(!!timezoneAttrib, "should only capture enter path on timezoned area")

	const hadZone = currentHoveringZone !== null;
	const newZoneIsDifferentFromLastOne = currentHoveringZone !== timezoneAttrib;

	if (newZoneIsDifferentFromLastOne) {
		if (hadZone) {
			// console.log(`reset highlight from zone ${currentHoveringZone}`);
			resetZoneHighlight(currentHoveringZone);
		}
		// console.log(`highlight zone ${timezoneAttrib}`);

		currentHoveringZone = timezoneAttrib;
		highlightZone(timezoneAttrib);
	}

	// console.log(`same zone as before to ${timezoneAttrib}`);
	// gmtWindow.style.display = "block";
	gmtWindow.classList.remove("hide");
	gmtWindow.classList.add("show");
}

const twoDigs = num => {
	num = Math.abs(num)
	return `${Math.trunc(num / 10)}${Math.trunc(num % 10)}`
};


// TODO: Implement
const clickedPaths = [];

let startZone = null;
let endinZone = null;


const mouseClickZone = path => {
	const timezoneAttrib = path.getAttribute(ZONE);
	console.assert(!!timezoneAttrib, "should only capture click on timezoned area")
	
	const rawIncrement = timeIncrementHoursByZone.get(timezoneAttrib);

	const incrementHours = Math.trunc(rawIncrement);
	const incrementMins  = rawIncrement % 1 * 60.0;

	const col = colorsByZone.get(timezoneAttrib);
	console.log(`clicked zone %c${timezoneAttrib}%c\nincrement of ${incrementHours}:${twoDigs(incrementMins%60)} (raw '${rawIncrement}')`, `color: ${col}`, `\\x1b[0m`);
}


const clampViewBoxXyToScreen = () => {
	if (viewBox.x <= 0) viewBox.x = 0;
	if (viewBox.y <= 0) viewBox.y = 0;

	const zoomedWid = originalSvgSize.wid / viewBox.scale;
	const zoomedHei = originalSvgSize.hei / viewBox.scale;

	// console.log(`pane dx in [${fix0(viewBox.x)}, ${fix0(viewBox.y)}] wid ${fix0(originalSvgSize.wid)} zoomed: ${fix0(zoomedWid)}\n` +
	// 	`${(viewBox.x + zoomedWid)} > ${originalSvgSize.wid} ? ${((viewBox.x + zoomedWid) >= originalSvgSize.wid)}`);
	if ((viewBox.x + zoomedWid) >= originalSvgSize.wid) viewBox.x = originalSvgSize.wid - zoomedWid;
	if ((viewBox.y + zoomedHei) >= originalSvgSize.hei) viewBox.y = originalSvgSize.hei - zoomedHei;
}




let isPanning = false;

const paneMouseStart = { x: -1, y: -1 }
const paneStart = { x: -1, y: -1 }

/** @param {MouseEvent} evt */
const updatePanning = evt => {
	if (!isPanning) return;

	console.assert(paneStart.x !== -1 && paneStart.y !== -1, "wtf");
	console.assert(paneMouseStart.x !== -1 && paneMouseStart.y !== -1, "wtf");

	// console.log(`pane start in [${fix(paneStart.x, 0)}, ${fix(paneStart.y, 0)}]`);
	const dx = evt.clientX - paneMouseStart.x;
	const dy = evt.clientY - paneMouseStart.y;
	// console.log(`pane dx in [${fix(dx, 0)}, ${fix(dy, 0)}]`);

	viewBox.x = paneStart.x - dx / viewBox.scale;
	viewBox.y = paneStart.y - dy / viewBox.scale;

	clampViewBoxXyToScreen();
}

const applyPanning = () => {
	if (isPanning) updateSvgViewBoxAttribute();
	requestAnimationFrame(applyPanning);
}

const onLostFocus = _ => {
	isPanning = false;
}

document.addEventListener("blur", onLostFocus);
window.addEventListener("blur", onLostFocus);

document.addEventListener("mousedown", evt => {
	if (evt.button == MIDDLE_BTN) {

		isPanning = true;
		paneMouseStart.x = evt.clientX;
		paneMouseStart.y = evt.clientY;
		paneStart.x = viewBox.x;
		paneStart.y = viewBox.y;
	}
});


// const svgVisibleArea = document.getElementById("g1");
// svgVisibleArea.addEventListener("mousemove", evt => {
document.addEventListener("mousemove", evt => {

	updatePanning(evt);

	if (!debugMode) return;

	if (test) return;

	raycastRect.x = evt.clientX;
	raycastRect.y = evt.clientY;
	raycastRect.width = 1;
	raycastRect.height = 1;

	const intersections = mainSvg.getIntersectionList(raycastRect, null);
	// console.log(`LIST: `);
	// console.log(intersecting);

	const isHoveringSmth = intersections.length > 0
	if (!isHoveringSmth) {

		if (hasLastHovered()) {
			// console.log(`undoing last thing fill`);
			resetLastHovered();
			currentHoveringDbg = null;
		}

		return;
	}

	console.assert(isHoveringSmth, "Should be hovering smth")

	// assert lastThing is a path
	const hoveredSmth = intersections[intersections.length - 1];
	// console.log(`all: `);
	// for (const intersection of intersections) {
	// 	console.log(intersection);
	// }
	// console.log(" ");
	

	if (!hasLastHovered()) {
		trySetLastHovered(hoveredSmth);
		return;
	}

	const hoveringNewShit = isHoveringNewShit(hoveredSmth);
	if (hoveringNewShit) {

		resetLastHovered();

		// console.log(`set last thing as hovered smth, style to 255`);
		trySetLastHovered(hoveredSmth);

		return;
	}

	// hoveringSameShitAsBefore
});

const countryColor = "rgb(179, 179, 179)";

const hoveredColor = "rgb(255, 128, 0)";

const alreadyAccountedForHoveredColor = "rgb(200, 158, 0)";
const clickedColor = "rgb(255, 0, 0)";

const LEFT_BTN   = 0;
const MIDDLE_BTN = 1;
// const RIGHT_BTN  = 2;

const allClickedParts = [];


document.addEventListener("mouseup", evt => {
// svgVisibleArea.addEventListener("mousedown", evt => {

	if (test) return;

	if (evt.button == LEFT_BTN) {

		if (evt.shiftKey) {

			// if ctrl key, join all the things in their zone

			if (allClickedParts.length === 0) {
				console.log(`NOTHING MARKED`);
				console.log(" ");	
				return;
			}

			console.log("ALL:");

			// let str = "const idsTODO = [\n";
			// for (const stuff of allClickedParts) str += `"${stuff.id}",\n`
			// str += "]"
			// console.log(str);

			let str = "const idsGmtPlus_   = [";
			for (const stuff of allClickedParts) str += ` "${stuff.id}",`
			str = str.slice(0, -1); // removes last ','
			str += " ];"
			console.log(str);

			console.log(" ");


			// console.log(`shift + down LEFT_BTN`);
			// lastThing.group = null;
			return;
		}

		if (evt.ctrlKey) {

			if (!currentHoveringDbg) return;

			if (!allClickedParts.includes(currentHoveringDbg)) {
				console.log(`trying to remove an item that is not on the array:`);
				
				return;
			}

			const ind = allClickedParts.indexOf(currentHoveringDbg);

			allClickedParts.splice(ind, 1);

			currentHoveringDbg.style.fill = countryColor;

			return;
		}

		if (lastHoveredDbg) {
			// lastHovered.group = "brasil";

			// console.log("->");
			// console.log(lastHoveredDbg);

			if (!allClickedParts.includes(lastHoveredDbg)) allClickedParts.push(lastHoveredDbg);

			lastHoveredDbg.style.fill = clickedColor;
			// const gotAttr = lastHoveredDbg.getAttribute(ZONE);
			// console.log(`got attrib: '${gotAttr}'`);
		}

		return;
	}

	if (evt.button == MIDDLE_BTN) {
		isPanning = false;
		return;
	}


});


requestAnimationFrame(applyPanning);


export {
	initSvgEvents, resizeSvg,
	test as prod, fillWholeMap,
	hoveredColor, clickedColor, countryColor, alreadyAccountedForHoveredColor,

	svgJsRoot,

	mouseEnterCountryPath, mouseEnterOcean, mouseClickZone as mouseClickPath,
};
