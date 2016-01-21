var mapLocation = "525+W+120th+St,+New+York,+NY+10027";
var useStatic = true;
var MAX_MAP_DIMENSION = 640;

function getStaticMapURL(loc, width, height, increaseScale) {
	console.log("getStaticMapUrl");
	var staticKey = "AIzaSyB2RU7jCfJysseKrYhm1BnlRyLrBbXdxGA";
	//var width = document.getElementById('sandbox').width;
	//var height = document.getElementById('sandbox').height;
	var scaleArg = increaseScale ? "&scale=2" : "";
	console.log("scale: " + scaleArg);
	var img = "http://maps.googleapis.com/maps/api/staticmap?center=" + loc +
		"&size=" + width + "x" + height + scaleArg + "&key=" + staticKey;
	console.log("done in getStaticMapUrl");
	return img;
}

function getEmbeddedMapURL(loc, width, height) {
	console.log("getEmbeddedMapUrl");
	var embedKey = "AIzaSyCp8EA3jlwhBcjlGP_ShEj-GVFP3D74pNw";
	var img = "https://www.google.com/maps/embed/v1/search?q=" + loc + "&key=" + embedKey;
	console.log("done in getEmbeddedMapUrl");
	return img;
}

function refreshMap() {
	var element = $($(".inner")[0]);
	console.log(element);
	var width = element.width();
	var height = element.height();
	console.log("refreshMap start: width = " + element.width() + ", height = " + element.height());
	// if canvas size > max image size, increase map resolution
	var increaseScale = (width > MAX_MAP_DIMENSION || height > MAX_MAP_DIMENSION);
	if(useStatic) {
		console.log("static");
		/* Resizing
		 * if the canvas dimensions are too big to fit the map on (> 1280 px with current Google Map API, including increased resolution/size) then we want to set max dimensions
		 * Cases:
		 *    1. Width > 640, height > 640 ===> do nothing
		 *    2. Exactly one of width/height > 640 ===> double larger to 640 max, halve smaller dimension (will be blown up with increased scale)
		 *          2a. Larger dimension <= 1280 ===> simple scaling
		 *          2b. Larger dimension > 1280 ===> set to 640 max dimension, calculate smaller dimension accordingly
		 *    3. Width > 640, height > 640 ===> set max dimensions if necessary
		 */
		 // if !increaseScale (case 1), do nothing further re: scaling/dimensions
		 if(!increaseScale) {
		 	console.log("Case 1");
		 }
		 if(increaseScale) {
		 	var newWidth, newHeight;
		 	if(width > MAX_MAP_DIMENSION && height > MAX_MAP_DIMENSION) { // case 3
		 		console.log("Case 3");
		 		newWidth = MAX_MAP_DIMENSION;
		 		newHeight = MAX_MAP_DIMENSION;
		 	} else { // case 2
		 		if(width >= height) {
		 			if(width > MAX_MAP_DIMENSION * 2) { // need to increase scale, while limiting dimensions to a max size
		 				console.log("Case 2b - width");
		 				newWidth = MAX_MAP_DIMENSION;
		 				newHeight = Math.round(height/2);
		 				//newHeight = Math.round(height / 2 * ((newWidth*2)/width)); // halve to account for doubled resolution scale, then adjust according to max size limits
		 			} else { // need to increase scale, but without needing to limit dimensions
		 				console.log("Case 2a - width");
		 				newWidth = Math.round(width / 2);
		 				newHeight = Math.round(height / 2);
		 			}
		 		} else { // height > width; same as above but with flipped dimensions
		 			if(height > MAX_MAP_DIMENSION * 2) {
		 				console.log("Case 2b - height");
		 				newHeight = MAX_MAP_DIMENSION;
		 				NewWidth = Math.round(width / 2); 
		 			} else { 
		 				console.log("Case 2a - height");
		 				newWidth = Math.round(width / 2);
		 				newHeight = Math.round(height / 2);
		 			}

		 		}
		 	}
		 	width = newWidth;
		 	height = newHeight;
			console.log("refreshMap middle: width = " + width + ", height = " + height);
		 }


		var imgUrl = getStaticMapURL(mapLocation, width, height, increaseScale);
		console.log(imgUrl);

		var PANEL_OFFSET = 18;

		if(increaseScale) {
			$("#display-panel").width(width * 2 + PANEL_OFFSET);
			$("#display-panel").height(height * 2 + PANEL_OFFSET);
			$("#input-panel").width(width * 2 + PANEL_OFFSET);
			//$("#input-panel").height(height * 2);
		}
		/*
		else {
			$("#display-panel").width(width);
			$("#input-panel").width(width);
			$("#display-panel").height(height);
			$("#input-panel").height(height);
		}
		*/

		// add map as background image
		console.log("refreshMap middle 2: width = " + width + ", height = " + height);
	    element.css("background-image", "url('" + imgUrl + "')");


		console.log("refreshMap end: width = " + element.width() + ", height = " + element.height());

	} else {
		console.log("embedded");
		var mapSource = getEmbeddedMapURL(mapLocation, width, height);
		console.log(mapSource);
		$("#embedded-map").attr("src", mapSource);
		$("#embedded-map").attr("width", width);
		$("#embedded-map").attr("height", height);
	}
	console.log("done in refreshMap()");
}

console.log("1");


$(document).ready(function(){
	refreshMap();
	$(window).resize(function() {
		refreshMap();
	});
	console.log("done");
	return;
});	


/*

Look at:

https://developers.google.com/maps/documentation/static-maps/intro

*/