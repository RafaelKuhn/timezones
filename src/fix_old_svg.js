
import { draw, viewBox,      initSvg as initSvgEvents, resizeSvg } from "/src/svg.js";



const resize = () => {
	resizeSvg();
}

resize();
initSvgEvents();




const ids31 = [
	"path16289",
	"path15880",
	"path16024",
	"path15881",
	"path15860",
	"path16041",
	"path15969",
	"path15968",
	"path16288",
	"path16141",
	"path16140",
]

for (const idTo31 of ids31) {
	const pathEl = document.getElementById(idTo31);
	pathEl.style.fill = "rgb(35, 31, 32)";
}

const blueShit = document.getElementById("path15765");
blueShit.style.fill = "rgb(156, 154, 155)";



const shitTexts = [
	"path15779",
	"path15821",
	"path15823",

	"path15819",
	"path15820",
	"path15777",
	"path15776",
	"path16145",
	"path15772",
]

for (let i = 15778; i <= 15817; i += 1) {
	shitTexts.push("path" + i);
}
for (const shit of shitTexts) {
	const pathEl = document.getElementById(shit);
	if (pathEl)
	pathEl.remove();
}

const australiaMid = document.getElementById("path2931");
australiaMid.style.fill = "rgb(179, 179, 179)";


const fixCocos = document.getElementById("path732");
fixCocos.setAttribute("transform", `matrix(0,1.3333333,1.3333333,0,1264.9768,689.75723)`);

var fixWater = document.getElementById("path35");
fixWater.setAttribute("d", 'M 0,0 H 77.415 V 35.316 H 56.944 L 50.486,27.084 H 37.753 v 11.53 H 0.094 L 0,0');

var fixWater = document.getElementById("path24");
fixWater.setAttribute("d", 'm 397.103,1325.73 h 103.135 v 128.54 H 397.103 Z');

var fixWater = document.getElementById("path20");
fixWater.setAttribute("d", 'M 50.834,1325.73 H 356.2 v 44 h -305.5 z');

// fixWater.style.fill = "rgb(255, 0, 0)"


/** @type {Array.<SVGPathElement>} */
const paths = draw.node.querySelectorAll("path");
console.log(`found ${paths.length} paths`);


let bool = true;
for (const path of paths) {

	if (path.style.fill === "rgb(204, 204, 204)") {
		if (bool) {

			bool = false;
			continue;
		}

		path.style.fill = "rgb(179, 179, 179)";
		continue;
	}

	// if (path.id !== "path20") path.remove();
}


const map = new Map();
for (const path of paths) {
	const fill = path.style.fill;

	// blue, yellow, orange
	// if (fill === "rgb(0, 0, 255)" || fill === "rgb(255, 255, 0)" || fill === "rgb(255, 102, 0)" || fill === "rgb(255, 127, 42)") {
	// 	path.style.fill = "rgb(179, 179, 179)"
	// }

	// if (fill === "rgb(135, 170, 222)") {
	// 	path.style.fill = "rgb(236, 236, 236)"
	// }

	// if (fill !== "rgb(236, 236, 236)") {
	// 	path.remove();
	// }

	if (fill === "url(\"#pattern57\")") {
		path.style.fill = "rgb(236, 236, 236)"
		
		// path.style.fill = "CRAP"
		// console.error(`wrong:`);
		// console.log(path);
		// map.set("CRAP", 1)
		// continue;
	}

	const num = map.get(fill);
	if (!num) {
		map.set(fill, 1)
	} else {
		map.set(fill, num + 1)
	}
}


// remaining after bool shit
document.getElementById("path351").style.fill = "rgb(179, 179, 179)";


// var n = 9; // 232 vertical ocean areas

// var n = 12; // 2315 core of the countries

// var n = 14; // 255 fine islands and buggy?
// var n = 15; // 462 ocean grid, fine lines

// var n = 17; // 1761 country borders

// var n = 27; // 6057 country contours
// var n = 28; // 1509 ocean contours
// var n = 29; // 26 lighter ocean contours
// var n = 30; // 8  lighter ocean contours 2
// var n = 31; // 408 country names

// var n = 32; // 2559 fine islands
// var n = 36; // 95 black dots of capitals, some countries' names lol

// var n = 38; // 102 seas, gulfs and bays


const colInds = [
	
	9, 12, 17, // NECESSARY: oceans, core countries, smaller islands (circles), country borders
	28, 29, 30, // cean contours 1, oc 2
	31, 36, 37, // country names, ocean names, +gmt labels
	34, // upper panel



	// 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
	// 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38
	






	// 31, 36, 37, 38, // names + capital DOTS

	// 34, // upper panel


	// unnecessary
	// 27, 32, // country contours, islands

	// 27, 28, 29, 30, // contours: country, oceans, ocean lighter 1, ocean lighter 2

	// 1, 2, 3, 4, 5, 6, 7, 8, // USELESS CRAP
	// 13, 16, 18, // useless crap
	// 20, 21, 22, 23, 24, 25, 26, // buggy useless crap

	// 33, // angles

]

const cols = [
	// "rgb(236, 236, 236)",
	// "rgb(179, 179, 179)",
	// "rgb(255, 255, 255)",

	// "rgb(101, 98, 99)",
];



// remove black texts (names of states)
draw.node.querySelectorAll("tspan").forEach(text => text.remove());


// LOG
var it = 0;
for (const entry of map) {
	console.log(`${it}: %c ${entry[0]}: ${entry[1]}`, `color: ${entry[0]}`);

	if (colInds.includes(it)) cols.push(entry[0]);
	it += 1;
}
console.log("");


var it = 0;
for (const path of paths) {
	// if (path.style.fill !== nthCol) path.remove();

	if (cols.length == 0) continue;
	if (!cols.includes(path.style.fill)) path.remove();

	// path.style.fill = "rgb(255, 0, 0)"


	// if (i == 1) {

	// 	console.log(`ID: '${path.id}'`);

	// 	const coords = path.getAttribute("d").split(" ")[1].split(",");
	// 	coords[0] = parseFloat(coords[0]);
	// 	coords[1] = parseFloat(coords[1]);

	// 	const d = path.getAttribute("d");
	// 	let d2 = d;
	// 	d2 = d.substring(0, d.length - 2);

	// 	console.log(`-> '${d2}'`);
		
	// 	d2 += ` ${coords[0]},${coords[1] - 150}`
	// 	console.log(`-> '${d2}'`);

	// 	d2 += " z"
	// }

	it += 1;
}

const remainingPaths = draw.node.querySelectorAll("path");
console.log(`remained ${remainingPaths.length} paths`);

map.clear();
for (const path of remainingPaths) {
	const num = map.get(path.style.fill)
	if (!num) {
		map.set(path.style.fill, 1)
	} else {
		map.set(path.style.fill, num + 1)
	}
}

var it = 0;
for (const entry of map) {
	console.log(`${it}: %c ${entry[0]}: ${entry[1]}`, `color: ${entry[0]}`);
	it += 1;
}



// save blob shit

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

 