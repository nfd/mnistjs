var canvas;

var pixelData = []; // 1D array
var PIXELS = 120;
var NN_PIXELS = 20;
var SCREEN_MULTIPLIER = 3;
var PIXELS_PER_NN_PIXEL = PIXELS / NN_PIXELS;

var isDrawing;

var lastX = -1, lastY = -1;

var brush9x9 = [
	[0,     0, 200, 255, 255, 255, 200,   0,  0],
	[0,   200, 255, 255, 255, 255, 255, 200,  0],
	[0,   255, 255, 255, 255, 255, 255, 255,  0],
	[255, 255, 255, 255, 255, 255, 255, 255, 255],
	[255, 255, 255, 255, 255, 255, 255, 255, 255],
	[255, 255, 255, 255, 255, 255, 255, 255, 255],
	[0,   255, 255, 255, 255, 255, 255, 255,  0],
	[0,   200, 255, 255, 255, 255, 255, 200,  0],
	[0,     0, 200, 255, 255, 255, 200,   0,  0]];

var brush7x7 = [
	[0,     0, 100, 255, 100,   0,  0],
	[0,   100, 255, 255, 255, 100,  0],
	[100, 255, 255, 255, 255, 255, 100],
	[255, 255, 255, 255, 255, 255, 255],
	[100, 255, 255, 255, 255, 255, 100],
	[0,   100, 255, 255, 255, 100,  0],
	[0,     0, 100, 255, 100, 0,    0]];

var brush5x5 = [
	[0,   200, 255, 200,  0],
	[200, 255, 255, 255, 200],
	[255, 255, 255, 255, 255],
	[200, 255, 255, 255, 200],
	[0,   200, 255, 200,  0]];

var brush3x3 = [
	[10,  200, 255],
	[200, 255, 0],
	[10,  2, 0]];

var brush2x2 = [
	[250, 250],
	[5, 5]];

var brush1x1 = [[255]];

function canvasRelativeX(pageX) {
	var rect = canvas.getBoundingClientRect();
	return pageX - rect.left;
}

function canvasRelativeY(pageY) {
	var rect = canvas.getBoundingClientRect();
	return pageY - rect.top;
}

function getPixelXFromPageX(pageX) {
	var canvasWidth = canvas.getBoundingClientRect().width;
	var multiplier = canvasWidth / PIXELS;
	return Math.floor(canvasRelativeX(pageX) / multiplier);
}

function getPixelYFromPageY(pageY) {
	var canvasHeight = canvas.getBoundingClientRect().height;
	var multiplier = canvasHeight / PIXELS;
	return Math.floor(canvasRelativeY(pageY) / multiplier);
}

function drawMouseStart(evt) {
	isDrawing = true;
	lastX = getPixelXFromPageX(evt.pageX) -1;
	lastY = getPixelYFromPageY(evt.pageY);

	return drawMouse(evt);
}

function drawEnd(evt) {
	isDrawing = false;
	run_network();
	return true;
}

function drawMouse(evt) {
	var x = getPixelXFromPageX(evt.pageX);
	var y = getPixelYFromPageY(evt.pageY);

	return draw(x, y);
}

function drawTouchStart(evt) {
	isDrawing = true;
	var touch = evt.touches.item(0);

	lastX = getPixelXFromPageX(touch.pageX) - 1;
	lastY = getPixelYFromPageY(touch.pageY);

	return drawTouch(evt);
}

function drawTouch(evt) {
	var touch = evt.touches.item(0);

	var x = getPixelXFromPageX(touch.pageX);
	var y = getPixelYFromPageY(touch.pageY);

	return draw(x, y);
}

function sizeCanvas() {
	// Choose a size based on window dimensions.
	// Note that setting the CSS height does nothing in firefox (annoyingly) and "real" values like "10cm" are scaled
	// in mobile browsers. Man, what a wasteland the web is.
	var multiplier;
	var portraitOrientation;
	
	if(window.innerHeight > window.innerWidth) {
		portraitOrientation = true;
		SCREEN_MULTIPLIER = Math.floor(window.innerWidth / PIXELS);
	} else {
		portraitOrientation = false;
		SCREEN_MULTIPLIER = Math.floor((window.innerHeight - 100)/ PIXELS);
	}

	SCREEN_MULTIPLIER = Math.min(SCREEN_MULTIPLIER, 4);

	canvas.width = PIXELS * SCREEN_MULTIPLIER;
	canvas.height = PIXELS * SCREEN_MULTIPLIER;

	return portraitOrientation;
}

function sizeElements() {
	/* Element size is based around canvas size */
	var portraitOrientation = sizeCanvas();
	var elements = document.getElementById("elements");
	var canvasRect = canvas.getBoundingClientRect();

	if(portraitOrientation) {
		elements.style.left = canvasRect.left + 'px';
		elements.style.top = canvasRect.bottom + 10 + 'px';
	} else {
		elements.style.left = canvasRect.right + 10 + 'px'; //canvas.style.right;
		elements.style.top = canvasRect.top + 'px';
	}

	// TODO: something with portraitOrientation?
}


function init() {
	console.log("What do you get if you multiply six by nine?");

	canvas = document.getElementById("canvas"); 

	// Choose a size based on window dimensions -- go for nearest integer multiple of half height.
	sizeElements();

	for(var i = 0; i < PIXELS * PIXELS; i++) {
		pixelData.push(255);
	}

	isDrawing = false;

	canvas.addEventListener("mousedown", drawMouseStart);
	canvas.addEventListener("mousemove", drawMouse);
	canvas.addEventListener("mouseup", drawEnd);

	canvas.addEventListener("touchstart", drawTouchStart);
	canvas.addEventListener("touchmove", drawTouch);
	canvas.addEventListener("touchend", drawEnd);

	document.getElementById("clearbutton").addEventListener("click", clear);

	//loadimage();
	//run_network();

	//var ctx = canvas.getContext("2d");

	/*
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, 280, 280);
	*/
	/*
	var a = [[1,2], [3, 4], [5, 6]];
	var b = [[10, 20], [30, 40], [50, 60]];
	console.table(matmult(a, transpose(b)));
	console.table(arraymult(a, b));
	*/

}

function updatePixel(ctx, x, y, val) {
	if(x < 0 || x >= PIXELS || y < 0 || y >= PIXELS)
		return;

	pixelData[(y * PIXELS) + x] = val;

	var preciseX = x * SCREEN_MULTIPLIER;
	var preciseY = y * SCREEN_MULTIPLIER;
	var colour = pixelData[(y * PIXELS) + x];

	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;

	ctx.fillStyle = 'rgba(' + colour + ',' + colour + ',' + colour + ',255)';
	ctx.fillRect(preciseX, preciseY, SCREEN_MULTIPLIER, SCREEN_MULTIPLIER);

	ctx.imageSmoothingEnabled = true;
	ctx.mozImageSmoothingEnabled = true;
}

function getPixel(x, y) {
	return pixelData[y * PIXELS + x];
}

function putBrush(ctx, centreX, centreY, brush) {
	var startX = Math.ceil(centreX - (brush[0].length / 2));
	var startY = Math.ceil(centreY - (brush.length / 2));

	for(var brushY = 0; brushY < brush.length; brushY++) {
		for(var brushX = 0; brushX < brush[brushY].length; brushX++) {
			var pixel = getPixel(brushX + startX, brushY + startY);
			pixel = Math.max(pixel - brush[brushY][brushX], 0);
			updatePixel(ctx, brushX + startX, brushY + startY, pixel);
		}
	}
}

function line(ctx, x1, y1, x2, y2, brush) {
	// http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
	// Define differences and error check
	var dx = Math.abs(x2 - x1);
	var dy = Math.abs(y2 - y1);
	var sx = (x1 < x2) ? 1 : -1;
	var sy = (y1 < y2) ? 1 : -1;
	var err = dx - dy;
	// Set first coordinates
	putBrush(ctx, x1, y1, brush);
	// Main loop
	while (!((x1 == x2) && (y1 == y2))) {
		var e2 = err << 1;
		if (e2 > -dy) {
			err -= dy;
			x1 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y1 += sy;
		}
		// Set coordinates
		putBrush(ctx, x1, y1, brush);
	}
}

function draw(x, y) {
	if(x < 0 || x >= PIXELS || y < 0 || y >= PIXELS) 
		isDrawing = false;

	if(isDrawing) {
		if (x != lastX || y != lastY) {
			var ctx = canvas.getContext("2d");

			//updatePixel(ctx, x, y, 0);
			//putBrush(ctx, x, y, brush5x5);
			line(ctx, lastX, lastY, x, y, brush9x9);
		}
	}

	lastX = x; lastY = y;
	return true;
}

function clear(evt) {
	for(var i = 0; i < (PIXELS * PIXELS); i++) {
		pixelData[i] = 255;
	}

	var ctx = canvas.getContext("2d");
	ctx.fillStyle = 'rgba(255,255,255,255)';
	ctx.fillRect(0, 0, SCREEN_MULTIPLIER * PIXELS, SCREEN_MULTIPLIER * PIXELS);
}

function loadimage() {

	var img = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.058823529411764705, 0.5803921568627451, 0.9921568627450981, 0.9921568627450981, 0.5137254901960784, 0.043137254901960784, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.03137254901960784, 0.3333333333333333, 0.6784313725490196, 0.7490196078431373, 0.8274509803921568, 0.9882352941176471, 0.9882352941176471, 0.9882352941176471, 0.9921568627450981, 0.6666666666666666, 0.027450980392156862, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.00784313725490196, 0.08627450980392157, 0.43137254901960786, 0.5686274509803921, 0.9098039215686274, 0.9176470588235294, 0.9882352941176471, 0.9882352941176471, 0.9803921568627451, 0.9411764705882353, 0.6980392156862745, 0.49411764705882355, 0.7019607843137254, 0.9921568627450981, 0.9882352941176471, 0.2901960784313726, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.4666666666666667, 0.9882352941176471, 0.9882352941176471, 0.9921568627450981, 0.9882352941176471, 0.8862745098039215, 0.8235294117647058, 0.7411764705882353, 0.27450980392156865, 0.13725490196078433, 0.0, 0.0, 0.41568627450980394, 0.9921568627450981, 0.9882352941176471, 0.39215686274509803, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.9098039215686274, 0.8862745098039215, 0.5764705882352941, 0.33725490196078434, 0.16470588235294117, 0.09411764705882353, 0.054901960784313725, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7607843137254902, 0.9921568627450981, 0.7137254901960784, 0.01568627450980392, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3843137254901961, 0.13725490196078433, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.8313725490196079, 1.0, 0.6588235294117647, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.8274509803921568, 0.9921568627450981, 0.6588235294117647, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.12549019607843137, 0.9098039215686274, 0.9921568627450981, 0.6588235294117647, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5254901960784314, 0.9882352941176471, 0.9921568627450981, 0.5529411764705883, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.03529411764705882, 0.8, 0.9882352941176471, 0.9921568627450981, 0.24705882352941178, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.08627450980392157, 0.9921568627450981, 0.9921568627450981, 0.8313725490196079, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.023529411764705882, 0.7411764705882353, 0.9882352941176471, 0.8274509803921568, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0784313725490196, 0.9647058823529412, 0.9882352941176471, 0.6196078431372549, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.18823529411764706, 0.9882352941176471, 0.9882352941176471, 0.41568627450980394, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.4980392156862745, 0.9882352941176471, 0.8156862745098039, 0.07058823529411765, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7411764705882353, 0.9921568627450981, 0.5764705882352941, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.9098039215686274, 0.9882352941176471, 0.5764705882352941, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.16862745098039217, 0.9490196078431372, 0.9882352941176471, 0.3686274509803922, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.6078431372549019, 0.9882352941176471, 0.8235294117647058, 0.054901960784313725, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2627450980392157, 0.9568627450980393, 0.396078431372549, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

	var ctx= canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;

	var idx = (28 * 4); // skip initial blank lines.
	for(y = 0; y < 20; y++) {
		idx += 4; // skip leading blanks
		for(x = 0; x < 20; x++) {
			var val = 255 - Math.floor(img[idx] * 255);
			updatePixel(ctx, x, y, val);
			idx++;
		}
		idx += 4; // skip trailing blanks
	}
	ctx.imageSmoothingEnabled = true;
	ctx.mozImageSmoothingEnabled = true;
}

function get_nn_pixel(nnX, nnY) {
	var count = 0;
	var imageStartX = nnX * PIXELS_PER_NN_PIXEL, imageStartY = nnY * PIXELS_PER_NN_PIXEL;

	for(imageY = 0; imageY < PIXELS_PER_NN_PIXEL; imageY ++) {
		for(imageX = 0; imageX < PIXELS_PER_NN_PIXEL; imageX ++) {
			count += getPixel(imageStartX + imageX, imageStartY + imageY);
		}
	}

	return count / (PIXELS_PER_NN_PIXEL * PIXELS_PER_NN_PIXEL);
}

function get_image_centre_of_mass() {
	var xcoords = 0;
	var ycoords = 0;

	var nsamples = 0;

	for(y = 0; y < PIXELS; y++) {
		for(x = 0; x < PIXELS; x++) {
			if(getPixel(x, y) != 255) {
				xcoords += x;
				ycoords += y;
				nsamples += 1;
			}
		}
	}

	return {"x": xcoords / nsamples, "y": ycoords / nsamples};
}

function get_image_for_nn() {
	/* Does the following transformations:
	 *
	 * 0. Finds the centre of mass. This is particularly important for '1', which always has some pixels in the centre.
	 * 1. Converts to greyscale (by just examining the R component) 
	 * 2. Pads the image to centre it based on its centre of mass.
	 * 3. Inverts the colours so that 1.0 is signal and 0.0 is ground.
	 *
	 * Returns the transformed image as a 2D array consisting of 784 columns and 1 row (ie of shape (1, 784)).
	*/ 

	centre_of_mass = get_image_centre_of_mass();
	nn_centre_x = centre_of_mass['x'] / PIXELS_PER_NN_PIXEL;
	nn_centre_y = centre_of_mass['y'] / PIXELS_PER_NN_PIXEL;

	//console.log("centre x " + nn_centre_x + " y " + nn_centre_y);

	// How many more columns do we need to add to the left to make this centred?
	// We can add a maximum of 8 since the NN was trained on 28x28 images.
	padOffsetLeft = Math.max(Math.min(4 + Math.floor((NN_PIXELS / 2) - nn_centre_x), 8), 0);
	padOffsetRight = 8 - padOffsetLeft;
	// How many more rows do we need to add to the top to make this centred?
	padOffsetTop  = Math.max(Math.min(4 + Math.floor((NN_PIXELS / 2) - nn_centre_y), 8), 0);
	padOffsetBottom = 8 - padOffsetTop;

	//console.log("pad offset left " + padOffsetLeft + " top " + padOffsetTop + " right " + padOffsetRight + " bottom " + padOffsetBottom);
	//
	// TODO would be useful also to stretch the padded image, since this is apparently how the NN was trained.

	var sample = [];

	function add_zero_rows(rows) {
		for(var row = 0; row < rows; row++) {
			for(var i = 0; i < 28; i++)
				sample.push(0);
		}
	}
	/* Initial padding. */
	add_zero_rows(padOffsetTop);

	for(var y = 0; y < NN_PIXELS; y++) {
		
		/* Initial null samples for this row */
		for(var pad = 0; pad < padOffsetLeft; pad++) {
			sample.push(0);
		}

		for(var x = 0; x < NN_PIXELS; x++) {

			var pixel = 255 - get_nn_pixel(x, y); /* Invert colours. TODO elsewhere? */
			sample.push(pixel / 255.0);
		}

		/* Final null samples for this row */
		for(var pad = 0; pad < padOffsetRight; pad++) {
			sample.push(0);
		}
	}
	/* Final rows of zeroes. */
	add_zero_rows(padOffsetBottom);

	var nn_x = [sample]; /* just one sample */
	return nn_x;
}

/* TODO: Load the first part of the test set and verify that the NN works. Then check the images */

function run_network() {
	//document.getElementById("values").innerHTML = get_image_for_nn();

	var layer0 = appendones(get_image_for_nn());

	var layer1 = appendones(logistic(matmult(layer0, weights0)));

	var layer2 = logistic(matmult(layer1, weights1));

	var max_idx = 0;
	for(var i = 0; i < 10; i++) {
		if(layer2[0][i] > layer2[0][max_idx])
			max_idx = i;
	}
	document.getElementById("guess").innerHTML = "<b>" + max_idx + "</b> (output: " + layer2[0][max_idx] + ")";
}

document.addEventListener("DOMContentLoaded", init, false);

