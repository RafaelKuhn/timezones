
import { debugMode, mouseEnterPath, hoveredColor, clickedColor, countryColor, mouseClickPath } from "./svg.js";
// from "/src/svg.js";


export const ZONE = "zone";

// const country = "country";

/** @type {Map.<String, Array.<SVGPathElement>>} */
export const svgsByZone = new Map();

/** @type {Set.<SVGPathElement>} */
export const registeredSvgsSet = new Set();

export const colorsByZone = new Map();
export const brightColorsByZone = new Map();

export const timeIncrementByZone = new Map();


const BLUE   = "rgb(0, 90, 200)";
const CYAN   = "rgb(20, 210, 220)";
const ORANGE = "rgb(250, 120, 80)";
const YELLOW = "rgb(217, 217, 45)";
const PINK   = "rgb(232, 64, 64)";


const B_BLUE   = "rgb(60, 150, 255)";
const B_CYAN   = "rgb(80, 255, 255)";
const B_ORANGE = "rgb(255, 180, 120)";
const B_YELLOW = "rgb(245, 245, 24)";
const B_PINK   = "rgb(255, 150, 150)";

const colorByColorIndex = index => {
	// if (index === -1) return BRIGHT_PINK;
	if (index === -1) return PINK;
	if (index === -2) return PINK;

	const mod = index % 4;
	if (mod === 0) return BLUE;
	if (mod === 1) return CYAN;
	if (mod === 2) return ORANGE;
	if (mod === 3) return YELLOW;

	console.error(`unregistered color for index ${index}`)
}

const selectedColorByColorIndex = index => {
	if (index === -1) return B_PINK;
	if (index === -2) return B_PINK;
	// if (index === -2) return PINK;

	const mod = index % 4;
	if (mod === 0) return B_BLUE;
	if (mod === 1) return B_CYAN;
	if (mod === 2) return B_ORANGE;
	if (mod === 3) return B_YELLOW;

	console.error(`unregistered color for index ${index}`)
}

/**
 * 
 * @param {String} gmtName
 * @param {Array.<String>} gmtIdsArray
 */
const assignIdsTo = (gmtName, gmtIdsArray, colIndex, increment) => {
	console.assert(typeof  increment != "undefined", "FORGOT INC");

	colorsByZone.set(gmtName, colorByColorIndex(colIndex));
	brightColorsByZone.set(gmtName, selectedColorByColorIndex(colIndex));

	timeIncrementByZone.set(gmtName, increment);

	const alreadyThere = svgsByZone.get(gmtName);

	/** @type {Array.<SVGPathElement>} */
	let svgs;

	if (!alreadyThere) {
		svgs = [];
		svgsByZone.set(gmtName, svgs);
	} else {
		svgs = alreadyThere;
	}

	for (const id of gmtIdsArray) {
		const svg = document.getElementById(id);
	
		svg.setAttribute(ZONE, gmtName);
		svgs.push(svg);

		registeredSvgsSet.add(svg);


		if (!debugMode) {

			svg.addEventListener("mouseenter", evt => {
				mouseEnterPath(evt.target);
			});

			svg.addEventListener("click", evt => {
				mouseClickPath(evt.target);
			});
			
		}
	}

}


export const assignIds = () => {
	// TODO: assign a number here to be the seed of the color

	let it = 0;

	// assignIdsTo("gmt-11", idsGmtMinus11, 0);
	assignIdsTo("gmt-10", idsGmtMinus10, ++it, -10);
	assignIdsTo("gmt-9",  idsGmtMinus9,  ++it, -9);
	assignIdsTo("gmt-8",  idsGmtMinus8,  ++it, -8);
	assignIdsTo("gmt-7",  idsGmtMinus7,  ++it, -7);
	assignIdsTo("gmt-6",  idsGmtMinus6,  ++it, -6);
	assignIdsTo("gmt-5",  idsGmtMinus5,  ++it, -5);
	assignIdsTo("gmt-4",  idsGmtMinus4,  ++it, -4);
	assignIdsTo("gmt-3",  idsGmtMinus3,  ++it, -3);
	assignIdsTo("gmt-2",  idsGmtMinus2,  ++it, -2);
	assignIdsTo("gmt-1",  idsGmtMinus1,  ++it, -1);
	assignIdsTo("gmt+0",  idsGmtZero,    ++it, 0);
	assignIdsTo("gmt+1",  idsGmtPlus1,   ++it, 1);
	assignIdsTo("gmt+2",  idsGmtPlus2,   ++it, 2);
	assignIdsTo("gmt+3",  idsGmtPlus3,   ++it, 3);
	assignIdsTo("gmt+4",  idsGmtPlus4,   ++it, 4);
	assignIdsTo("gmt+5",  idsGmtPlus5,   ++it, 5);
	assignIdsTo("gmt+6",  idsGmtPlus6,   ++it, 6);
	assignIdsTo("gmt+7",  idsGmtPlus7,   ++it, 7);
	assignIdsTo("gmt+8",  idsGmtPlus8,   ++it, 8);
	assignIdsTo("gmt+9",  idsGmtPlus9,   ++it, 9);
	assignIdsTo("gmt+10", idsGmtPlus10,  ++it, 10);
	assignIdsTo("gmt+11", idsGmtPlus11,  ++it, 11);
	assignIdsTo("gmt+12", idsGmtPlus12,  ++it, 12);
	assignIdsTo("gmt+14", idsGmtPlus14,  ++it, 14);

	assignIdsTo("gmt-3_1/2", idsGmtMinus3andAHalf, -1, -3 - 1/2);
	assignIdsTo("gmt+3_1/2", idsGmtPlus3AndAHalf,  -1,  3 + 1/2);
	assignIdsTo("gmt+4_1/2", idsGmtPlus4AndAHalf,  -2,  4 + 1/2);
	assignIdsTo("gmt+5_1/2", idsGmtPlus5AndAHalf,  -1,  5 + 1/2);
	assignIdsTo("gmt+6_1/2", idsGmtPlus6AndAHalf,  -2,  6 + 1/2);
	assignIdsTo("gmt+9_1/2", idsGmtPlus9AndAHalf,  -1,  9 + 1/2);

	assignIdsTo("gmt+5_3/4", nePalMeuPal, -2, 5 + 3/4);
}

const idsGmtMinus10 = [ "path387", "path746", "path569", "path751", "path565", "path920", "path530", "path388", "path924", "path410", "path747", "path743", "path566", "path384", "path547", "path1065", "path1064", "path900", "path527", "path901", "path896", "path734", "path885", "path1055", "path714", "path709", "path552", "path540", "path866", "path370", "path895", "path911", "path739", "path558", "path562", "path915", "path359", "path891", "path906", "path1059", "path699", "path1035", "path1045", "path352", "path528", "path715", "path886", "path700", "path357", "path893", "path538", "path710", "path705", "path717", "path523", "path362", "path898", "path1040", "path880", "path503", "path856", "path724", "path730", "path905", "path535", "path929", "path575", "path570", "path752", "path393", "path939", "path580", "path567", "path403", "path934", "path398", "path757", "path871", "path881", "path1050", "path890", "path1060", "path690", "path888", "path553", "path712", "path537", "path933", "path2722", "path1046", "path686", "path691", "path2575", "path500", "path853", "path677", "path1032", "path488", "path494", "path671", "path665", "path841", "path1026", "path847", "path1021" ];
const idsGmtMinus9  = [ "path2806", "path1791", "path2105", "path2863", "path2709", "path3055", "path3057", "path2563", "path2250", "path3155", "path2656", "path3019", "path1054", "path875", "path2644", "path2069", "path3068" ];
const idsGmtMinus8  = [ "path1996", "path2620", "path1792", "path1733", "path2391", "path2287", "path2585", "path2529", "path1632", "path561", "path779", "path670", "path846", "path1025", "path487" ];
const idsGmtMinus7  = [ "path1621", "path2609", "path3065", "path2032", "path2614", "path2358", "path2769", "path2268", "path2975", "path2514", "path2352", "path1614", "path2649", "path2414", "path2120", "path2355", "path1725", "path2307", "path2161", "path3017", "path3012", "path1941", "path1870", "path3073", "path3020", "path2023", "path2174", "path2718", "path2159", "path2067", "path2984", "path2465", "path3027", "path1680", "path1836", "path3266", "path2322", "path2433", "path2228", "path1847", "path3127", "path2226", "path2423", "path383", "path525", "path1062", "path702" ];
const idsGmtMinus6  = [ "path2729", "path1933", "path1788", "path2917", "path2359", "path2653", "path2966", "path1679", "path1835", "path3066", "path2652", "path2112", "path2218", "path1781", "path2754", "path3062", "path1939", "path1828", "path2060", "path2104", "path2261", "path3030", "path2073", "path3153", "path2511", "path1731", "path3026", "path1973", "path1635", "path2426", "path2124", "path1989", "path2309", "path2761", "path1843", "path2969", "path2915", "path2133", "path3121", "path1940", "path2405", "path3256", "path3106", "path2280", "path2903", "path2881", "path367", "path1886", "path2171", "path1743", "path2873" ];
const idsGmtMinus5  = [ "path2880", "path1944", "path3093", "path1893", "path2593", "path2008", "path2525", "path3072", "path2746", "path2974", "path3052", "path2297", "path3303", "path2072", "path3304", "path1693", "path2828", "path1612", "path2179", "path2419", "path1613", "path3010", "path1935", "path2657", "path3111", "path2512", "path2918", "path1803", "path2568", "path2870", "path2125", "path2166", "path3151", "path2367", "path3077", "path2929", "path2619", "path2572", "path2811", "path2853", "path2467", "path1729", "path2822", "path1831", "path2607", "path2308", "path2163", "path2760", "path2464", "path2066", "path1878", "path1930", "path1984", "path1631", "path2553", "path2422", "path3120", "path2078", "path2827", "path2274", "path2664", "path2270", "path2564", "path3162", "path2027", "path2255", "path883", "path903", "path619", "path2970", "path2768", "path2366", "path1938", "path1841", "path1983", "path1686", "path2821", "path3258", "path1768", "path2599", "path2751" ];
const idsGmtMinus4  = [ "path3253", "path3201", "path3237", "path2449", "path3056", "path1645", "path2943", "path2839", "path2379", "path2680", "path1971", "path2185", "path2474", "path2771", "path1956", "path2479", "path2757", "path2155", "path2116", "path722", "path545", "path797", "path976", "path968", "path967", "path966", "path3222", "path3193", "path1811", "path3232", "path3231", "path3226", "path3238", "path3223", "path3212", "path3210", "path3199", "path3243", "path3200", "path3215", "path3239", "path3207", "path3203", "path3217" ];
const idsGmtMinus3  = [ "path2995", "path2390", "path2139", "path2492", "path2780", "path2982", "path1707", "path1808", "path1952", "path2236", "path2988", "path2091", "path2634", "path2285", "path3133", "path2084", "path2001", "path3092", "path1814", "path1651", "path3086", "path1958", "path3172", "path2631", "path2584", "path2674", "path3090", "path2889", "path3184", "path2920", "path2835", "path1857", "path2738", "path1758", "path3182", "path2627", "path3044", "path3042", "path2488", "path2188", "path2764", "path1899", "path2480", "path2923", "path2193", "path2243", "path3134", "path2312", "path1817", "path3003", "path2002", "path2610", "path2847", "path2950", "path3138", "path1766", "path3048", "path1653", "path2400", "path2448", "path2742", "path2335", "path3174", "path2283", "path607", "path1994", "path1697", "path1852" ];
const idsGmtMinus2  = [ "path878", "path1057", "path697", "path520", "path868", "path692", "path515", "path1052", "path873", "path990", "path811", "path2430" ];
const idsGmtMinus1  = [ "path395", "path749", "path572", "path926", "path568", "path390", "path936", "path587", "path759", "path941", "path582", "path764", "path405", "path400", "path577", "path2765" ];
const idsGmtZero    = [ "path3069", "path1960", "path2048", "path2683", "path2997", "path2494", "path2203", "path2797", "path2791", "path687", "path2094", "path3095", "path2395", "path2739", "path2587", "path2952", "path2749", "path2842", "path1655", "path1962", "path2686", "path2005", "path2143", "path2245", "path2444", "path2638", "path3000", "path2496", "path3136", "path2487", "path2044", "path2629", "path2782", "path2186", "path2330", "path2501", "path754", "path931", "path2833", "path2672", "path1950", "path1643", "path2377", "path2534", "path2234", "path3181", "path2183", "path2288", "path3091", "path2921", "path3255", "path2793", "path2378", "path1717", "path1822", "path2402", "path2891", "path499", "path1036", "path676", "path1047", "path510", "path852", "path922", "path745" ];
const idsGmtPlus1   = [ "path2583", "path2695", "path3269", "path3040", "path2438", "path2887", "path1999", "path2733", "path1915", "path2594", "path1716", "path2850", "path1963", "path2337", "path2016", "path3141", "path2694", "path2137", "path2149", "path2251", "path2050", "path2639", "path2953", "path1862", "path2902", "path1969", "path2750", "path3188", "path3185", "path1949", "path3125", "path3131", "path1705", "path2232", "path2082", "path1805", "path2831", "path2670", "path1659", "path2985", "path2999", "path1967", "path1800", "path1856", "path2993", "path2098", "path1916", "path2498", "path2904", "path1807", "path2240", "path2912", "path2338", "path2135", "path2235", "path1617", "path2209", "path2279", "path2962", "path1777", "path2350", "path2810", "path1926", "path3049", "path2138", "path2059", "path2482", "path2327", "path2392", "path1778", "path1075", "path3059", "path1904", "path1618", "path3084", "path2941", "path2625", "path1901", "path2882", "path2996", "path2632", "path2491", "path2196", "path1968", "path2172", "path2727", "path1815", "path1885", "path1894", "path2004", "path1897", "path627", "path2792", "path1031", "path2042" ];
const idsGmtPlus2   = [ "path2393", "path2682", "path2834", "path2885", "path2731", "path1703", "path1854", "path3179", "path2673", "path3344", "path1920", "path2779", "path3107", "path2299", "path2622", "path2152", "path1721", "path1865", "path2641", "path3008", "path3306", "path2540", "path2987", "path2216", "path2351", "path3176", "path2894", "path1644", "path1900", "path1756", "path2778", "path2035", "path2478", "path1722", "path2278", "path2633", "path2483", "path2130", "path1751", "path2051", "path1917", "path2728", "path1951", "path1755" ];
const idsGmtPlus3   = [ "path727", "path3319", "path2723", "path2181", "path2428", "path2576", "path3032", "path2275", "path1749", "path3170", "path2877", "path3410", "path3403", "path3312", "path3341", "path3310", "path3351", "path3311", "path3397", "path3354", "path3338", "path3413", "path3316", "path3399", "path3329", "path3308", "path3322", "path3407", "path3328", "path3355", "path3326", "path3404", "path3402", "path3422", "path3313", "path3315", "path3314", "path3330", "path3406", "path3415", "path3357", "path3405", "path3398", "path3325", "path3396", "path3409", "path3337", "path3420", "path3343", "path3416", "path3414", "path3333", "path3359", "path3317", "path3342", "path2490", "path2489", "path2304", "path1896", "path2432", "path1990", "path2435", "path3259", "path2064", "path1641", "path2895", "path3186", "path2942", "path571", "path446", "path442", "path984", "path801", "path406", "path583", "path937", "path629", "path452", "path2579", "path1699", "path3126", "path1074", "path1830", "path1823" ];
const idsGmtPlus4   = [ "path3423", "path3323", "path3339", "path3360", "path3421", "path3348", "path2442", "path2681", "path2092", "path2840", "path2284", "path2439", "path2888", "path432", "path609", "path401", "path578", "path974", "path436", "path755", "path970", "path791", "path613", "path786", "path820", "path816", "path461", "path999", "path643", "path638", "path978", "path795", "path738", "path615", "path438", "path793", "path1674", "path1757", "path769", "path946", "path951", "path592", "path415" ];
const idsGmtPlus5   = [ "path3335", "path2374", "path3124", "path2080", "path2230", "path2830", "path3321", "path3352", "path3358", "path3336", "path3408", "path3346", "path3417", "path3400", "path3307", "path2348", "path2189", "path2909", "path1649", "path969", "path760", "path2669", "path863", "path1042", "path1068", "path1067", "path511", "path688", "path1066", "path1072", "path1070", "path1071", "path1069", "path859", "path869", "path1048", "path506", "path683", "path693", "path1038", "path516", "path1043" ];
const idsGmtPlus6   = [ "path3401", "path1579", "path2799", "path2453", "path2937", "path908", "path550", "path372", "path913", "path737", "path377" ];
const idsGmtPlus7   = [ "path3350", "path3080", "path2666", "path1695", "path2530", "path2079", "path2476", "path2373", "path2126", "path3078", "path2229", "path1848", "path2577", "path2127", "path2936", "path3122", "path2981", "path1892", "path2429", "path1946", "path2323", "path2668", "path1637", "path1694", "path3356", "path3327", "path3412", "path3419", "path3331", "path3320", "path3353", "path2776", "path2231", "path2086", "path2180", "path2316", "path1701", "path2580", "path2134", "path2434", "path1997", "path3013", "path2637", "path1654", "path2194", "path2331", "path2486", "path2202", "path2443", "path2586", "path2691", "path1754", "path1919", "path1702", "path2804", "path3130", "path2591", "path2848", "path2088", "path2054", "path505", "path1821", "path3135" ];
const idsGmtPlus8   = [ "path1650", "path2295", "path3148", "path1867", "path1711", "path2294", "path1760", "path2249", "path2684", "path2998", "path2099", "path2147", "path2886", "path2459", "path682", "path858", "path2303", "path2503", "path3190", "path3152", "path2775", "path3016", "path2938", "path2623", "path1801", "path2755", "path2354", "path2199", "path1639", "path2603", "path2965", "path2560", "path2813", "path2648", "path1929", "path1730", "path2061", "path2859", "path1874", "path2481", "path1753", "path3178", "path2878", "path3123", "path2724", "path2939", "path3345", "path3347", "path1945", "path1771", "path1905", "path2436", "path2777" ];
const idsGmtPlus9   = [ "path3426", "path3424", "path3432", "path3428", "path3442", "path3440", "path3450", "path3448", "path3436", "path3433", "path3439", "path3452", "path3441", "path3437", "path3453", "path3455", "path3449", "path3443", "path3438", "path3444", "path3457", "path3447", "path3454", "path3445", "path3451", "path3418", "path3456", "path3309", "path2325", "path2688", "path3109", "path2651", "path2857", "path3064", "path2900", "path1677", "path972", "path434", "path964", "path605", "path782", "path959", "path777", "path772", "path595", "path1037", "path600", "path428", "path423", "path954", "path564", "path2558", "path2158", "path1728", "path2412", "path3014", "path1872", "path1833", "path2026", "path2463", "path1976", "path2110", "path2132", "path1995", "path2916", "path2758", "path771", "path953", "path412", "path948", "path599", "path961", "path422", "path958", "path784", "path3001", "path2244", "path2732", "path2795", "path2783", "path2397", "path3038", "path2601", "path3180", "path2951", "path1898", "path2336", "path2238", "path2187", "path2342", "path2043", "path1855", "path2049", "path1713", "path3139", "path2630", "path2899", "path1660", "path2957", "path2582", "path1961", "path1708", "path2677", "path2233", "path1818", "path2892", "path3094", "path1912", "path2992", "path1860", "path956" ];
const idsGmtPlus10  = [ "path3427", "path3430", "path3446", "path3411", "path3324", "path3334", "path1061", "path882", "path887", "path529", "path351", "path706", "path534", "path711", "path862", "path459", "path832", "path650", "path838", "path636", "path473", "path844", "path989", "path656", "path451", "path997", "path455", "path1023", "path814", "path993", "path1006", "path802", "path981", "path645", "path612", "path973", "path458", "path790", "path1001", "path468", "path640", "path977", "path822", "path996", "path817", "path1704", "path1903", "path2628", "path2990", "path2836", "path2485", "path3128", "path3183", "path1636", "path2890", "path2334", "path2096", "path2954", "path426", "path785", "path588", "path416", "path598", "path593", "path775", "path947", "path942", "path957", "path573", "path780", "path962", "path952", "path765", "path608", "path421", "path411", "path2844" ];
const idsGmtPlus11  = [ "path3425", "path3429", "path3458", "path3431", "path3434", "path3435", "path3318", "path3340", "path2176", "path2876", "path809", "path992", "path454", "path988", "path631", "path635", "path450", "path3087", "path2781", "path1921", "path2597", "path2908", "path2055", "path3263", "path391", "path3054", "path982", "path803", "path799", "path625", "path444", "path621", "path986", "path807", "path448", "path554", "path721", "path489", "path897", "path371", "path907", "path376", "path1027", "path912", "path902", "path736", "path930", "path753", "path586", "path758", "path940", "path581", "path399", "path396", "path935", "path932", "path585", "path404", "path2986", "path944", "path611", "path394", "path767", "path789", "path927", "path726", "path731", "path544", "path763", "path750", "path549", "path1073", "path603", "path770" ];
const idsGmtPlus12  = [ "path3332", "path3349", "path892", "path991", "path698", "path971", "path979", "path1053", "path796", "path353", "path1063", "path899", "path812", "path987", "path914", "path723", "path556", "path457", "path378", "path368", "path622", "path800", "path884", "path879", "path1058", "path358", "path614", "path975", "path713", "path889", "path728", "path983", "path904", "path541", "path546", "path551", "path792", "path536", "path894", "path874", "path1010", "path955", "path831", "path965", "path606", "path1005", "path778", "path783", "path960", "path995", "path501", "path773", "path821", "path1000", "path950", "path655", "path787", "path1004", "path648", "path1009", "path1013", "path842", "path834", "path652", "path1020", "path1019", "path675", "path945", "path865", "path486", "path492", "path1030", "path1039", "path1646", "path1049", "path641", "path657", "path679", "path855", "path689", "path1024", "path1044", "path1034", "path850", "path497", "path1029", "path674", "path1002", "path823", "path839", "path663", "path1018", "path502", "path474", "path828", "path651", "path851", "path597", "path943", "path774", "path589", "path1923", "path2802", "path3265", "path2205" ];
const idsGmtPlus14   = [ "path1016", "path484", "path1022", "path843", "path661", "path478" ];

const idsGmtMinus3andAHalf  = [ "path2785", "path1928", "path1678", "path1782" ];
const idsGmtPlus3AndAHalf   = [ "path3296" ];
const idsGmtPlus4AndAHalf   = [ "path3286" ];
const idsGmtPlus5AndAHalf   = [ "path2009", "path3291", "path2153", "path2452", "path1670", "path2253", "path1720", "path2022", "path2103", "path3143" ];
const nePalMeuPal = [ "path1663" ];
const idsGmtPlus6AndAHalf   = [ "path2384", "path3302", "path732" ];
const idsGmtPlus9AndAHalf   = [ "path1909", "path2931", "path2499", "path1657" ];
