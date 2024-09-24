
import { prod, hoveredColor, clickedColor, grayColor } from "/src/svg.js";


export const ZONE = "zone";

const country = "country";

export const svgsByZone = new Map();

export const assignIds = () => {
	const gmtMinus3 = "gmt-3";

	const svgs = [];
	svgsByZone.set(gmtMinus3, svgs);

	for (const id of idsBr4) {
		const svg = document.getElementById(id);
		svg.setAttribute(country, "br");
		svg.setAttribute(ZONE, gmtMinus3);

		svgs.push(svg);

		if (prod) {
			svg.addEventListener("mouseenter", evt => {
				// evt.target.style.fill = hoveredColor;
				evt.target.style.fill = "rgb(0, 127, 0)";
			});

			svg.addEventListener("mouseleave", evt => {
				evt.target.style.fill = grayColor;
			});
		}

	}
}


const idsBr4 = [
	"path2995",
	"path2390",
	"path2139",
	"path2492",
	"path2780",
	"path2982",
	"path1707",
	"path1808",
	"path1952",
	"path2236",
	"path2988",
	"path2091",
	"path2634",
	"path2285",
	"path3133",
	"path2084",
	"path2001",
	"path3092",
	"path1814",
	"path1651",
	"path3086",
	"path1958",
	"path3172",
	"path2631",
	"path2584",
	"path2674",
	"path3090",
	"path2889",
	"path3184",
	"path2920",
	"path2835",
	"path1857",
	"path2738",
	"path1758",
	"path3182",
	"path2627",
	"path3044",
	"path3042",
	"path2488",
	"path2188",
]

