/**
 *  Scripts for month poem
 *  Taichi Aritomo
 *  Assumes monospace font
 */

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const skyCharacter = '/';
const voidCharacter = '&nbsp;';

let charWidth,
		charHeight,
		numRows,
		numCols,
		dateStrings = [],
		dotString = '',
		date = new Date(),
		sunUnitWidth = 70, // number of characters consumed by the sun void's width
		sunUnitHeight,
		sunRadius,
		sunUnitRowOffset = 6,
		sunUnitColOffsetCenter = 9,
		sunUnitColOffsetAmp = 20,
		sunUnitColOffset,
		sunTable = [];     // cached grid for sun void


function measure() {
	const spanElement = document.body.querySelector('span');
	charWidth = spanElement.offsetWidth / spanElement.innerText.length;
	charHeight = spanElement.offsetHeight;
	numRows = Math.round(document.body.offsetHeight / charHeight);
	numCols = Math.round(document.body.offsetWidth / charWidth);
	sunUnitColOffsetCenter = numCols;
	sunUnitHeight = Math.round(charWidth / charHeight * sunUnitWidth);
	sunRadius = (sunUnitWidth / 2) * charWidth;
}


function createDotString() {
	for (let i = 0; i < numCols; i++) {
		dotString += skyCharacter;
	}
}


function createSunTable() {
	for (let i = 0; i < sunUnitHeight; i++) {
		sunTable[i] = '';
		let i_half = i + 0.5;
		for (let j_half = 0.5; j_half < sunUnitWidth; j_half++) {
			const dx = (j_half) * charWidth - sunRadius,
						dy = (i_half) * charHeight - sunRadius,
						d = Math.sqrt(dx*dx + dy*dy);
			sunTable[i] += d < sunRadius ? voidCharacter : skyCharacter;
		}
	}
}


function draw() {
	let html = '',
			sunFirstRow = Math.max(0, numRows - sunUnitRowOffset - sunUnitHeight),
			sunLastRow  = numRows - sunUnitRowOffset,
			sunFirstCol = numCols - sunUnitColOffset - sunUnitWidth;
	
	// first non-sun rows
	for (let r = 0; r < sunFirstRow; r++) {
		const dateString = dateStrings[r];
		html += '<span>';
		html += dateString;
		html += dotString.substr(0, numCols - dateString.length);
		html += '</span><br/>';
	}
	
	// sun rows
	for (let r = sunFirstRow, sR = 0; sR < sunUnitHeight; r++, sR++) {
		const dateString = dateStrings[r];
		html += '<span>';
		html += dateString;
		html += dotString.substr(0, sunFirstCol - dateString.length);
		html += sunTable[sR];
		html += dotString.substr(0, sunUnitColOffset);
		html += '</span><br/>';
	}
	
	// last non-sun rows
	for (let r = sunFirstRow+sunUnitHeight; r < numRows; r++) {
		const dateString = dateStrings[r];
		html += '<span>';
		html += dateString;
		html += dotString.substr(0, numCols - dateString.length);
		html += '</span><br/>';
	}
	
	document.body.innerHTML = html;
}


function initialize() {
	while (dateStrings.length < numRows) {
		step();
	}
}


function step() {
	// add a new month
	const dateString = monthNames[date.getMonth()] + ' ' + date.getFullYear();
	dateStrings.push(dateString);
	
	// remove the oldest month
	if (dateStrings.length > numRows) {
		dateStrings.shift(); // remove from front
	}
	
	// change sun vertical position
	// sunUnitColOffset = sunUnitColOffsetCenter + sunUnitColOffsetAmp + Math.round(sunUnitColOffsetAmp * Math.sin(date.getMonth() * Math.PI / 6));
	sunUnitColOffset = sunUnitColOffsetCenter;
	
	// increment date
	date.setMonth(date.getMonth() + 1);
}


measure();
createDotString();
createSunTable();
initialize();
draw();

setInterval(() => {
	step();
	draw();
}, 100);

window.addEventListener('resize', () => {
	measure();
	initialize();
});

let mouseIsDown;

document.body.addEventListener('mousedown', (e) => {
	sunUnitRowOffset = Math.max(0, Math.round(numRows - ((e.clientX + sunRadius) / charHeight)));
	sunUnitColOffsetCenter = Math.max(0, Math.round((e.clientY - sunRadius) / charWidth));
	mouseIsDown = true;
});

document.body.addEventListener('mouseup', (e) => {
	mouseIsDown = false;
})

document.body.addEventListener('mousemove', (e) => {
	if (mouseIsDown) {
		sunUnitRowOffset = Math.max(0, Math.round(numRows - ((e.clientX + sunRadius) / charHeight)));
		sunUnitColOffsetCenter = Math.max(0, Math.round((e.clientY - sunRadius) / charWidth));
	}
})