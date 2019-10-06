const srcText = document.getElementById('src-text');
const resultText = document.getElementById('result-text');
const hiddenContainer = document.getElementById('src-container');
const hiddenSVG = hiddenContainer.querySelector('svg');
const demoClipPathBefore = document.getElementById('clip-path-before');
const demoClipPathAfter = document.getElementById('clip-path-after');

srcText.value = `M202.098,12.935 L159.216,145.402 L18.392,145.402 C8.668,145.402 0.95,153.858 0.95,163.662 C0.947773812,169.447353 3.7604707,174.872053 8.49,178.204 C11.304,180.111 122.237,261.152 122.237,261.152 C122.237,261.152 79.632,391.987 78.806,394.073 C78.176,395.98 77.723,398.074 77.723,400.248 C77.723,410.061 85.62,417.966 95.345,417.966 C99.071,417.966 102.523,416.785 105.432,414.791 L219,319.106 C219,319.106 331.716805,414.181811 332.569,414.791 C335.468,416.785 338.93,417.966 342.647,417.966 C352.372,417.966 360.277,409.972 360.277,400.248 C360.277,398.074 359.827,395.98 359.185,394.073 C358.37,391.987 315.764,261.152 315.764,261.152 C315.764,261.152 426.688,180.111 429.508,178.204 C434.051,175.019 437.05,169.661 437.05,163.574 C437.05,153.857 429.508,145.402 419.783,145.402 L278.961,145.402 L235.892,12.935 C233.81,5.482 227.081,0.034 219,0.034 C210.909,0.034 204.192,5.482 202.098,12.935 Z`;

// srcText.value = `M 20,20 h 160 v 160 h -80 v -80 h -80 z`;
// srcText.value = `M 10,110 L 10,10 L 40,50 L 70,10 L 100,50 L 130,10 L 130,110 z`;
// srcText.value = `M 100,20 L 180,160 L 20,160 z`;
// srcText.value = `M 20 20 C 150,20 150,150 20,150`;
// srcText.value = `M 20 20 c 150,20 150,150 20,150`;
// srcText.value = `M 20 20 S 180,100 20,180`;
// srcText.value = `M 20 20 s 180,100 20,180`;
// srcText.value = `M 20 20 Q 180,100 20,180`;
// srcText.value = `M 20 20 q 180,100 20,180`;
// srcText.value = `M 20 20 T 60,100 180,20`;
// srcText.value = `M 20 20 t 60,100 180,20`;
// srcText.value = `M 20 20 A20,35 0 0,0 170,2`;
// srcText.value = `M 20 20 a20,35 0 0,0 170,20`;


var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
path.setAttribute('d', srcText.value);
hiddenSVG.appendChild(path)

demoClipPathBefore.innerHTML = '';
demoClipPathBefore.appendChild(path.cloneNode(true));

const pathSizes = path.getBBox();
const coords = path.getAttribute('d');

// Приводим координаты в одному виду, без пробелов
const coordsNormalized = normalizePathCoords(coords);
console.log('\ncoordsNormalized')
console.log(coordsNormalized);
// Собираем все координаты от одной буквы до другой не включая другую
const coordsList = [...coordsNormalized.matchAll(/[a-z][^(a-z)]{1,}/gi)];

const coordsTramsformed = coordsList.map(item => {
  let value = item[0];
  console.log('\nvalue', value);
  const commandSrc = value.substring(0,1);
  const command = commandSrc.toLowerCase();
  const coords = value.substring(1).replace(/,$/,'');

  const keysListByCommand = {
    'm': ['x', 'y'],
    'l': ['x', 'y'],

    'h': ['x'],
    'v': ['y'],

    'c': ['x', 'y', 'x1', 'y1', 'x2', 'y2'],

    's': ['x', 'y', 'x1', 'y1'],
    'q': ['x', 'y', 'x1', 'y1'],
    't': ['x', 'y', 'x1', 'y1'],

    'a': ['rx', 'ry', 'x-axis-rotation', 'large-arc-flag', 'sweep-flag', 'x', 'y']
  };

  if(keysListByCommand[command]) {
    const transformedValsList = transformvaluesByKeys(keysListByCommand[command], coords)
    value = `${commandSrc}${transformedValsList.join(',')}`;
  }

  if(command == 'm' || command == 'l') {
    const keysList = ['x', 'y'];
    const transformedValsList = transformvaluesByKeys(keysList, coords)
    value = `${commandSrc}${transformedValsList.join(',')}`;
  }
  else {
    console.log('Undetected command: ', command)
    console.log(command, coords)
  }
  return value;
})

console.log(coordsList)
console.log(coordsTramsformed)
let resultPath = coordsTramsformed.join(',');
resultPath += 'Z';

demoClipPathAfter.innerHTML = '';
const pathAfter = demoClipPathAfter.appendChild(path.cloneNode(true));
pathAfter.setAttribute('d', resultPath);

resultText.value = resultPath;

// console.log(coordsNormalized.split(/[a-z][^(a-z)]{1,}/gi))

function transformvaluesByKeys(keysList, coords) {
  const valuesList = coords.split(',');
  const transformedValuesList = valuesList.map((item, index) => {
    if(keysList[index].includes('rotation')|| keysList[index].includes('flag')) {
      return item;
    }
    else if(keysList[index].includes('x')) {
      return item/pathSizes.width;
    }
    else if(keysList[index].includes('y')) {
      return item/pathSizes.height;
    }

    return item;
  });
  return transformedValuesList;
}

function normalizePathCoords(coords) {
let result = coords
  .replace(/([a-z]) /gi, '$1')
  .replace(/,\s{1,}/gi, ',')
  .replace(/\s{1,},/gi, ',')
  .replace(/\s{1,}/gi, ',');

return result;
}
