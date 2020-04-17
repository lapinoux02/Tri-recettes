let getLineType = (line) => {
	if (line.indexOf('####') !== -1) return 'sscategory';
	if (line.indexOf('###') !== -1) return 'scategory';
	if (line.indexOf('##') !== -1) return 'category';
	if (line.trim().length) return 'link';
}

let getName = (line) => {
	return line.replace(/#/g, '').trim();
}

let getTosort = (line) => {
	let res = line.match(/\[(.*?)\]\((.*?)\)/);
	return {text: res[1], url: res[2]}
}

const fs = require('fs');

const trPath = `D:/Workspace/test/liens.md`;
const twPath = `D:/Workspace/test/liens.json`;

let lines = fs.readFileSync(trPath).toString().split('\n');

let o = [];
let curCat;
let curScat;
let curSscat;
lines.forEach(line => {
	let lineType = getLineType(line);
	switch(lineType) {
		case 'category':
			curCat = {
				name: getName(line),
				list: []
			};
			curScat = null;
			curSscat = null;
			o.push(curCat);
			break;
		case 'scategory':
			curScat = {
				name: getName(line),
				list: []
			};
			curSscat = null;
			if (curCat.scategories) {
				curCat.scategories.push(curScat)
			} else {
				curCat.scategories = [curScat];
			}
			break;
		case 'sscategory':
			curSscat = {
				name: getName(line),
				list: []
			};
			if (curScat.sscategories) {
				curScat.sscategories.push(curSscat)
			} else {
				curScat.sscategories = [curSscat];
			}
			break;
		case 'link':
			let tosort = getTosort(line);

			if (curSscat) {
				curSscat.list.push(tosort);
			} else if (curScat) {
				curScat.list.push(tosort);
			} else if (curCat) {
				curCat.list.push(tosort);
			}
			break;
	}
});

fs.writeFileSync(twPath, `const DATA = ` + JSON.stringify(o));