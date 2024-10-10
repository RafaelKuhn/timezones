
// Has UTC+05 timestamps
// import { svg } from "/src/svg_files/original_svg.js"

// Has no UTC+05 timestamps
// import { svg } from "/src/svg_files/new_svg.js"

// Has no countours
import { svg } from "/src/svg_files/newest_svg.js"

// import { SVG } from "./svg.min.js" // LIB

import { ZONE, svgsByZone, colorsByZone, brightColorsByZone, timeIncrementByZone as timeIncrementHoursByZone, prettyZoneNamesByZone, unlitColorsByZone, sortedZonesData } from "./countries.js";
// from "/src/countries.js";


// const IS_12_HOUR_FORMAT = false;
const IS_12_HOUR_FORMAT = true;


const bottomWindow = document.getElementById("fixbot");

/** @type {HTMLHeadingElement} */
const gmtHourText = document.getElementById("gmt-hour");
/** @type {SVGTextElement} */
const gmtText = document.getElementById("gmt");

const hoverUi = document.getElementById("hover-div");
const selectUi = document.getElementById("select-div");

const closeSelectModeButton = document.getElementById("closeSelectModeBtn");


/** @type {HTMLHeadingElement} */
const selectedGmtHeader0 = document.getElementById("sel-header-1");
const selectedGmtHeader1 = document.getElementById("sel-header-2");

const hoveringHeaderDefault = selectedGmtHeader1.innerHTML;

/** @type {HTMLHeadingElement} */
const selectedGmtHour0 = document.getElementById("sel-gmt-hour-1");
const selectedGmtHour1 = document.getElementById("sel-gmt-hour-2");

/** @type {SVGTextElement} */
const selectedGmtSvgText0 = document.getElementById("sel-gmt-1");
const selectedGmtSvgText1 = document.getElementById("sel-gmt-2");


const showSelectUiInPanel = () => {
	showGmtWindow();

	bottomWindow.style.pointerEvents = "auto";

	hoverUi.style.display  = "none";
	selectUi.style.display = "block";
}

const showHoverUiInPanel = () => {
	bottomWindow.style.pointerEvents = "none";

	hoverUi.style.display  = "block";
	selectUi.style.display = "none";
}

showHoverUiInPanel();


/** @type {HTMLDivElement} */
const container = document.getElementById("container");

// const svgJsRoot = SVG().addTo(container).svg(svg); // LIB
const svgJsRoot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svgJsRoot.innerHTML = svg;
container.appendChild(svgJsRoot);


/** @type {HTMLElement & SVGSVGElement} */
// const mainSvg = svgJsRoot.node; // LIB
const mainSvg = svgJsRoot;


const fix = (v, n) => v.toFixed(n);
const fix2 = v => v.toFixed(2);
const fix0 = v => v.toFixed(0);

/** @type {{ x: Number, y: Number, wid: Number, hei: Number, scale: Number }} */
const attrFromVbox = vbox => `${fix(vbox.x, 2)} ${fix(vbox.y, 2)} ${fix(vbox.wid, 2)} ${fix(vbox.hei, 2)}`
/** @type {{ x: Number, y: Number, wid: Number, hei: Number, scale: Number }} */
const debugStrVbox = vbox => `[${fix(vbox.x, 0)}, ${fix(vbox.y, 0)}, ${fix(vbox.wid, 0)}, ${fix(vbox.hei, 0)}] sc ${vbox.scale}`


// const firstInnerNode = svgJsRoot.node.firstChild; // LIB
const firstInnerNode = svgJsRoot.querySelector("svg");

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

const undoHoverSelectMode = () => {
	paintMapAsSelectMode();

	resetSelectedGmtHour();
	nullSvgGmtText(selectedGmtSvgText1);

	setDefaultCursor();
}

const hideGmtWindow = () => {
	bottomWindow.classList.remove("show");
	bottomWindow.classList.add("hide");
}

const showGmtWindow = () => {
	bottomWindow.classList.remove("hide");
	bottomWindow.classList.add("show");
}

const resetZoneAsHovered = zoneName => {
	paintZoneNamed(zoneName, colorsByZone.get(zoneName));
}

/** * @param {Date} date */
const formatDate = date => {
	const hours   = date.getHours();
	const minutes = date.getMinutes();
	if (IS_12_HOUR_FORMAT) {
		if (hours >= 12) {
			return `${hours === 0 ? 12 : hours}:${twoDigs(minutes)}<span class="am"> PM</span>`;
		} else {
			return `${hours === 0 ? 12 : hours}:${twoDigs(minutes)}<span class="am"> AM</span>`;
		}
	}
	return `${hours}:${twoDigs(minutes)}`
}

// TODO: move paint functions close together
const applyZoneNameToSvgGmtText = (svgGmtText, zoneName, color) => {
	svgGmtText.textContent = prettyZoneNamesByZone.get(zoneName);
	svgGmtText.style.fill = color;
}

const nullSvgGmtText = svgGmtText => {
	svgGmtText.textContent = "";
}


const setZoneAsHovered = zoneName => {
	const brightColor = brightColorsByZone.get(zoneName);

	const date = getDateTimeOf(zoneName);
	gmtHourText.innerHTML = formatDate(date);

	applyZoneNameToSvgGmtText(gmtText, zoneName, colorsByZone.get(zoneName));
	paintZoneNamed(zoneName, brightColor);
}

const paintZoneNamed = (zoneName, color) => {
	const svgs = svgsByZone.get(zoneName);
	for (const svg of svgs) {
		svg.style.fill = color;
	}
}

const highlightZoneSelectMode = zoneName => {
	// TODO: perf, check if had highlighted one before, unhighlight it

	// TODO: WHITE STEPS IN BETWEEN THE TWO SELECTED ZONES

	// const highlightStartObj = sortedZonesData.find(data => data.name === selectModeData.startZoneName);
	// const highlightEndObj = sortedZonesData.find(data => data.name === zoneName);

	// const zoneStride = highlightEndObj.index - highlightStartObj.index;
	// const incrementDirection = Math.sign(zoneStride);

	// const startIndInclusive = highlightStartObj.index + incrementDirection;
	// const endIndExclusive   = highlightStartObj.index + zoneStride;

	// for (let i = startIndInclusive; i != endIndExclusive; i += incrementDirection) {
	// 	const zoneName = sortedZonesData[i].name;
	// 	paintZoneNamed(zoneName, "white");
	// }

	// paintZoneNamed(zoneName, selectModeColor);
	paintZoneNamed(zoneName, colorsByZone.get(zoneName));
	applyZoneNameToSvgGmtText(selectedGmtSvgText1, zoneName, colorsByZone.get(zoneName));

}

const MINS_TO_MILLIS = 60 * 1000;
const getDateTimeOf = zoneName => {
	const date = new Date();
	const offsetMins = date.getTimezoneOffset();

	// here, date is UTC
	date.setTime(date.getTime() + offsetMins * MINS_TO_MILLIS);

	const minsIncrement = timeIncrementHoursByZone.get(zoneName) * 60;
	date.setTime(date.getTime() + minsIncrement * MINS_TO_MILLIS);

	return date;
}

const setDefaultCursor = () => {
	document.body.style.cursor = "default";
}

const setPointerCursor = () => {
	document.body.style.cursor = "pointer";
}


const mouseClickOcean = () => {
	if (isSelectMode()) {
		exitSelectMode();
		hideGmtWindow();
	}
}

const mouseEnterOcean = () => {
	if (isSelectMode()) {
		undoHoverSelectMode();
		return;
	}

	setDefaultCursor();
	
	const hadZone = currentHoveringZone !== null;
	if (hadZone) {
		resetZoneAsHovered(currentHoveringZone);
		currentHoveringZone = null;
	}

	hideGmtWindow();
}


// this will be called in between states of the same country, so it's not a "mouseEnterZone"
// TODO: perf, call based on "mouseEnterDifferentZone" no need to call for every country path
const mouseEnterCountryPath = path => {

	const zoneName = path.getAttribute(ZONE);
	console.assert(!!zoneName, "should only capture enter path on timezoned area")

	if (isSelectMode()) {
		const hoveringStartZone = zoneName === selectModeData.startZoneName;
		if (hoveringStartZone) {
			undoHoverSelectMode();
			return;
		}

		paintMapAsSelectMode();
		highlightZoneSelectMode(zoneName);
		setPointerCursor();

		const date = getDateTimeOf(zoneName);
		selectedGmtHour1.innerHTML = formatDate(date);
		selectedGmtHeader1.innerHTML = hoveringHeaderDefault;

		return;
	}

	setPointerCursor();

	const hadZone = currentHoveringZone !== null;
	const newZoneIsDifferentFromLastOne = currentHoveringZone !== zoneName;

	if (newZoneIsDifferentFromLastOne) {
		if (hadZone) {
			// console.log(`reset highlight from zone ${currentHoveringZone}`);
			resetZoneAsHovered(currentHoveringZone);
		}
		// console.log(`highlight zone ${timezoneAttrib}`);

		currentHoveringZone = zoneName;
		setZoneAsHovered(zoneName);
	}

	// console.log(`same zone as before to ${timezoneAttrib}`);
	// gmtWindow.style.display = "block";
	showGmtWindow();
}

const twoDigs = num => {
	num = Math.abs(num)
	return `${Math.trunc(num / 10)}${Math.trunc(num % 10)}`
};


/** @type {{ is: Number, startZoneName: String }} */
const selectModeData = {
	is: false,
	startZoneName: null,
}
const isSelectMode = () => selectModeData.is;


const mouseClickZone = path => {
	const zoneName = path.getAttribute(ZONE);
	console.assert(!!zoneName, "should only capture click on timezoned area")

	enterSelectModeWithZone(zoneName);
}

const resetSelectedGmtHour = () => {
	selectedGmtHour1.innerHTML = "";
	selectedGmtHeader1.innerHTML = "";
	nullSvgGmtText(selectedGmtSvgText1);
}

const enterSelectModeWithZone = zoneName => {
	selectModeData.is = true;
	selectModeData.startZoneName = zoneName;
	setDefaultCursor();
	showSelectUiInPanel();

	const date = getDateTimeOf(zoneName);
	selectedGmtHour0.innerHTML = formatDate(date);
	applyZoneNameToSvgGmtText(selectedGmtSvgText0, zoneName, selectModeColor);
	// console.log(`selected zone ${zoneName}, (${date.getHours()}:${twoDigs(date.getMinutes())})`);

	resetSelectedGmtHour();

	paintMapAsSelectMode();
}

const exitSelectMode = () => {
	selectModeData.is = false;
	// selectModeData.startZone = null;

	setDefaultCursor();
	showHoverUiInPanel();

	paintMapAsDefaultMode();
}

const paintMapAsDefaultMode = () => {
	colorTimezones();
}

const colorTimezones = () => {
	for (const [ zoneName, paths ] of svgsByZone) {
		const col = colorsByZone.get(zoneName);

		for (const path of paths) {
			path.style.fill = col;				
		}
	}
}

const paintMapAsSelectMode = () => {
	for (const [ zone, pathArr ] of svgsByZone) {

		if (zone !== selectModeData.startZoneName) {
			for (const path of pathArr) {
				// path.style.fill = countryColor;
				path.style.fill = unlitColorsByZone.get(zone);
				// path.style.fill = colorsByZone.get(zone);
			}

		} else {
			for (const path of pathArr) {
				path.style.fill = selectModeColor;
				// path.style.fill = colorsByZone.get(zone);
			}

		}
	}
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
const selectModeColor = "rgb(119, 7, 247)";

// DEBUG MODE
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

bottomWindow.addEventListener("mouseenter", _ => {
	if (isSelectMode()) {
		undoHoverSelectMode();
		return;
	}
});

closeSelectModeButton.addEventListener("click", _ => exitSelectMode());

requestAnimationFrame(applyPanning);


export {
	initSvgEvents, resizeSvg,
	test as prod, fillWholeMap,
	hoveredColor, clickedColor, countryColor, alreadyAccountedForHoveredColor,

	svgJsRoot,

	mouseEnterCountryPath, mouseEnterOcean, mouseClickZone, mouseClickOcean,

	colorTimezones,

	enterSelectModeWithZone,
};
