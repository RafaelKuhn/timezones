
// import { svg } from "/src/svg_files/original_svg.js"
// import { svg } from "/src/svg_files/new_svg.js"
import { svg } from "/src/svg_files/newest_svg.js"

import { SVG } from "./svg.min.js"

import { ZONE, svgsByZone } from "./countries.js";



/** @type {HTMLDivElement} */
const container = document.getElementById("container");

const svgJsRoot = SVG().addTo(container).svg(svg);

/** @type {HTMLElement & SVGSVGElement} */
// /** @type {HTMLElement & SVGElement} */
const mainSvg = svgJsRoot.node;



const fix = (v, n) => v.toFixed(n);
const fix2 = v => v.toFixed(2);

/** @type {{ x: Number, y: Number, wid: Number, hei: Number }} */
const attrFromVbox = vbox => `${fix(vbox.x, 2)} ${fix(vbox.y, 2)} ${fix(vbox.wid, 2)} ${fix(vbox.hei, 2)}`


const firstInnerNode = svgJsRoot.node.firstChild;
const resizeFirstInnerNodeFromContainer = () => {
	firstInnerNode.setAttribute("width",  container.offsetWidth);
	firstInnerNode.setAttribute("height", container.offsetHeight);
}

const viewBox = { x: 0, y: 0, wid: mainSvg.clientWidth, hei: mainSvg.clientHeight };
const originalSvgSize = { wid: mainSvg.clientWidth, hei: mainSvg.clientHeight };

const updateoriginalSvgSize = () => {
	originalSvgSize.wid = mainSvg.clientWidth;
	originalSvgSize.hei = mainSvg.clientHeight;
}

const updateViewBoxAttribute = () => {
	mainSvg.setAttribute("viewBox", attrFromVbox(viewBox));
}


const initSvg = () => {

	// draw = SVG();
	// draw.addTo(container);
	// draw.svg(svg);


	// console.log(`w ${window.innerHeight}, h ${window.innerWidth}`);

	// son of "mainSvg"
	// const node = draw.node.firstChild;
	// node.setAttribute("width",  container.offsetWidth);
	// node.setAttribute("height", container.offsetHeight);

	// mainSvg = draw.node;
	// viewBox = { x: 0, y: 0, wid: mainSvg.clientWidth, hei: mainSvg.clientHeight };

	// updateViewBoxAndMainSvg();

	// mainSvg.setAttribute("viewBox", attrFromVbox(viewBox));
	// const originalSvgSize = { wid: mainSvg.clientWidth, hei: mainSvg.clientHeight };

	document.addEventListener("wheel", wheelEvt => {
	// svgVisibleArea.addEventListener("wheel", wheelEvt => {

		const zoomSpeed = 0.05;
		const zoomAmount = Math.sign(-wheelEvt.deltaY) * zoomSpeed;

		const dw = viewBox.wid * zoomAmount;
		const dh = viewBox.hei * zoomAmount;
		const dx = dw * wheelEvt.offsetX / originalSvgSize.wid;
		const dy = dh * wheelEvt.offsetY / originalSvgSize.hei;

		viewBox.x += dx;
		if (viewBox.x < 0) viewBox.x = 0;
		viewBox.y += dy;
		if (viewBox.y < 0) viewBox.y = 0;
		viewBox.wid -= dw;
		if (viewBox.wid > originalSvgSize.wid) viewBox.wid = originalSvgSize.wid;
		viewBox.hei -= dh;
		if (viewBox.hei > originalSvgSize.hei) viewBox.hei = originalSvgSize.hei;

		// const scale = originalSvgSize.wid / viewBox.wid;
		// zoomValue.innerText = `${Math.round(scale*100)/100}`;
		// console.log(`vbox: ${fix2(viewBox.x)} ${fix2(viewBox.y)} ${fix2(viewBox.wid)} ${fix2(viewBox.hei)}, ${Math.round(scale * 100) / 100}x`);

		updateViewBoxAttribute();
	});


}


const resizeSvg = () => {

	container.width  = `${window.innerWidth}px`
	container.height = `${window.innerHeight}px`
	resizeFirstInnerNodeFromContainer();

	updateoriginalSvgSize();

	// this will reset the zoom on resizing
	viewBox.x = 0;
	viewBox.y = 0;
	viewBox.wid = mainSvg.clientWidth;
	viewBox.hei = mainSvg.clientHeight;

	updateViewBoxAttribute();
}



updateoriginalSvgSize();
updateViewBoxAttribute();




/** @type {SVGPathElement} */
let lastHoveredDbg = null;

/** @type {SVGPathElement} */
let currentHoveringDbg = null;



/** @type {String} */
let lastHoveredZoneName = null;


const splitUrl = document.location.toString().split("?");
console.assert(splitUrl.length >= 1, "should have an url");


let debugMode = false;
let prod = false;

if (splitUrl.length > 1) {
	const firstSplitByQuestionMark = splitUrl[1];
	if (firstSplitByQuestionMark.includes("debug")) debugMode = true;
	if (firstSplitByQuestionMark.includes("prod"))  prod = true;
}

console.log(`debug mode: ${debugMode}, prod: ${prod}`);
console.assert(!(debugMode && prod), "shouldnt have both prod and debug mode")





if (prod) {

}



const hasLastHovered = debugMode ?
() => lastHoveredDbg !== null :
() => lastHoveredZoneName !== null;

// const hasLastHovered = () => lastHoveredZoneName !== null;

const isHoveringNewShit = debugMode ?
nowHovering => {
	return nowHovering !== lastHoveredDbg;
} :
nowHovering => {
	const gotAttr = nowHovering.getAttribute(ZONE);
	if (!gotAttr) {
		return true;
	}

	return gotAttr != lastHoveredZoneName;
}

const trySetLastHovered = debugMode ? hoveredSmth => {
	currentHoveringDbg = hoveredSmth;

	if (hoveredSmth.style.fill !== grayColor) return;

	lastHoveredDbg = hoveredSmth;
	hoveredSmth.style.fill = hoveredColor;
} :
hoveredSmth => {
	if (hoveredSmth.style.fill != grayColor) return;

	const gotAttr = hoveredSmth.getAttribute(ZONE);
	if (!gotAttr) {
		// error
		return;
	}

	const gmtSvgs = svgsByZone.get(gotAttr);
	if (!gmtSvgs) {
		// error
		return;
	}

	// TODO: check for same gmt was hovered and don't redo work
	for (const gmtSvg of gmtSvgs) {
		gmtSvg.style.fill = hoveredColor;
	}

	lastHoveredZoneName = gotAttr;
}

const resetLastHovered = debugMode ? () => {

	if (allClickedParts.includes(lastHoveredDbg)) return;

	lastHoveredDbg.style.fill = grayColor;
	lastHoveredDbg = null;
} :
() => {
	const gmtSvgs = svgsByZone.get(lastHoveredZoneName);
	if (!gmtSvgs) {
		console.error(`should have smth here`);
		return;
	}

	for (const gmtSvg of gmtSvgs) {
		gmtSvg.style.fill = grayColor;
	}
	
	
	lastHoveredZoneName = null;
}



const rect = mainSvg.createSVGRect();

const svgVisibleArea = document.getElementById("g1");
// svgVisibleArea.addEventListener("mousemove", evt => {
document.addEventListener("mousemove", evt => {

	if (prod) return;

	rect.x = evt.clientX;
	rect.y = evt.clientY;
	rect.width = 1;
	rect.height = 1;

	const intersecting = mainSvg.getIntersectionList(rect, null);
	// console.log(`LIST: `);
	// console.log(intersecting);

	const isHoveringSmth = intersecting.length > 0
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
	const hoveredSmth = intersecting[intersecting.length - 1];

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

const grayColor = "rgb(179, 179, 179)";

const hoveredColor = "rgb(255, 128, 0)";
const clickedColor = "rgb(255, 0, 0)";

const LEFT_BTN   = 0;
const MIDDLE_BTN = 1;
// const RIGHT_BTN  = 2;

const allClickedParts = [];


document.addEventListener("mouseup", evt => {
// svgVisibleArea.addEventListener("mousedown", evt => {

	if (prod) return;

	if (evt.button == LEFT_BTN) {

		if (evt.ctrlKey) {

			if (!currentHoveringDbg) return;

			if (!allClickedParts.includes(currentHoveringDbg)) {
				console.log(`trying to remove an item that is not on the array:`);
				
				return;
			}

			const ind = allClickedParts.indexOf(currentHoveringDbg);

			allClickedParts.splice(ind, 1);

			currentHoveringDbg.style.fill = grayColor;

			return;
		}

		if (evt.shiftKey) {
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

			let str = "const idsTODO = [";
			for (const stuff of allClickedParts) str += ` "${stuff.id}",`
			str = str.slice(0, -1); // removes last ','
			str += " ];"
			console.log(str);

			console.log(" ");


			// console.log(`shift + down LEFT_BTN`);
			// lastThing.group = null;
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
		console.log(`down MIDDLE_BTN`);

		return;
	}

	
})


const test = (x, y, wid, hei) => {
	// viewBox.x = 
}



export {
	initSvg, resizeSvg,
	prod,
	hoveredColor, clickedColor, grayColor,
	
	
	
	
	originalSvgSize,   svgJsRoot as draw };
