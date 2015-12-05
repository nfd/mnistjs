var canvas;

var pixelData = []; // 1D array
var PIXELS = 20;
var SCREEN_MULTIPLIER = 15;
var SCREEN_XY = PIXELS * SCREEN_MULTIPLIER;

var isDrawing;

var lastX = -1, lastY = -1;

var brush3x3 = [
	[10,  200, 255],
	[200, 255, 0],
	[10,  2, 0]];

var brush2x2 = [
	[250, 250],
	[5, 5]];

var brush1x1 = [[255]];

function canvasRelativeX(evt) {
	var rect = canvas.getBoundingClientRect();
	return evt.pageX - rect.left;
}

function canvasRelativeY(evt) {
	var rect = canvas.getBoundingClientRect();
	return evt.pageY - rect.top;
}

function init() {
	canvas = document.getElementById("canvas"); 
	canvas.width = SCREEN_XY;
	canvas.height = SCREEN_XY;

	for(var i = 0; i < PIXELS * PIXELS; i++) {
		pixelData.push(255);
	}

	isDrawing = false;

	canvas.addEventListener("mousedown", function(evt) {isDrawing = true; x = canvasRelativeX(evt) - 1; y = canvasRelativeY(evt); draw(evt); return true;});
	canvas.addEventListener("mousemove", draw);
	canvas.addEventListener("mouseup", function(evt) {isDrawing = false; run_network(); return true;});

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

function draw(evt) {
	if(isDrawing) {
		var x = Math.floor(canvasRelativeX(evt) / SCREEN_MULTIPLIER);
		var y = Math.floor(canvasRelativeY(evt) / SCREEN_MULTIPLIER);
		if (x != lastX || y != lastY) {
			var ctx = canvas.getContext("2d");

			//updatePixel(ctx, x, y, 0);
			putBrush(ctx, x, y, brush2x2);
			lastX = x; lastY = y;
		}

	}
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

function get_image_for_nn() {
	/* Does the following transformations:
	 *
	 * 1. Converts to greyscale (by just examining the R component) 
	 * 2. Pads the image by 4 pixels on each side 
	 * 3. Inverts the colours so that 1.0 is signal and 0.0 is ground.
	 *
	 * Returns the transformed image as a 2D array consisting of 784 columns and 1 row (ie of shape (1, 784)).
	*/ 
	var sample = [];

	function add_zero_rows(rows) {
		for(row = 0; row < rows; row++) {
			for(i = 0; i < 28; i++)
				sample.push(0);
		}
	}
	/* Initial four rows of zeroes. */
	add_zero_rows(4);
	for(var y = 0; y < PIXELS; y++) {
		
		/* Initial four null samples for this row */
		sample.push(0); sample.push(0); sample.push(0); sample.push(0); 

		for(var x = 0; x < PIXELS; x++) {

			var pixel = 255 - pixelData[y * PIXELS + x]; /* Invert colours. TODO elsewhere? */
			sample.push(pixel / 255.0);
		}

		/* Final four null samples for this row */
		sample.push(0); sample.push(0); sample.push(0); sample.push(0); 
	}
	/* Final four rows of zeroes. */
	add_zero_rows(4);

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
	console.log(max_idx + " " + layer2[0][max_idx]);
}

document.addEventListener("DOMContentLoaded", init, false);

