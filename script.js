const PathConverter = function (params) {
  this.srcTextElem = params.srcTextElem;
  this.resultTextElem = params.resultTextElem;
  demoTargetElem = params.demoTargetElem;

  const addExamples = params.addExamples;

  const demosTmpl = document.getElementById('demos-tmpl');
  demoTargetElem.appendChild(demosTmpl.content.cloneNode(true));

  const demoSVG = demoTargetElem.querySelector('.src-container svg');
  this.demoPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  demoSVG.appendChild(this.demoPath);

  this.demoClipPathBefore = demoTargetElem.querySelector('#clip-path-before');
  this.demoClipPathAfter = demoTargetElem.querySelector('#clip-path-after');

  this.srcTextElem.value = `M-2.068 13.842c.61-3.7.54-10.906 4.9-13.41C5.85-1.301 9.713-.95 12.888-2.375`;
  this.coords = this.srcTextElem.value;

  if(addExamples) {
    this.addExamples();
  }

  this.updateView();

  this.srcTextElem.addEventListener('input', () => {
    console.log('hello');
    this.coords = this.srcTextElem.value;
    this.updateView();
  })
}

// ------------------------------

PathConverter.prototype.addExamples = function () {
  const examples = [
    `M 20,20 h 160 v 160 h -80 v -80 h -80 z`,
    `M 10,110 L 10,10 L 40,50 L 70,10 L 100,50 L 130,10 L 130,110 z`,
    `M 100,20 L 180,160 L 20,160 z`,
    `M 20 20 C 150,20 150,150 20,150`,
    `M 20 20 c 150,20 150,150 20,150`,
    `M 20 20 S 180,100 20,180`,
    `M 20 20 s 180,100 20,180`,
    `M 20 20 Q 180,100 20,180`,
    `M 20 20 q 180,100 20,180`,
    `M 20 20 T 60,100 180,20`,
    `M 20 20 t 60,100 180,20`,
    `M 20 20 A20,35 0 0,0 170,2`,
    `M 20 20 a20,35 0 0,0 170,20`,
    `M202.098,12.935 L159.216,145.402 L18.392,145.402 C8.668,145.402 0.95,153.858 0.95,163.662,C0.947773812,169.447353 3.7604707,174.872053 8.49,178.204 C11.304,180.111 122.237,261.152 122.237,261.152 C122.237,261.152 79.632,391.987 78.806,394.073 C78.176,395.98 77.723,398.074 77.723,400.248 C77.723,410.061 85.62,417.966 95.345,417.966 C99.071,417.966 102.523,416.785 105.432,414.791 L219,319.106 C219,319.106 331.716805,414.181811 332.569,414.791 C335.468,416.785 338.93,417.966 342.647,417.966 C352.372,417.966 360.277,409.972 360.277,400.248 C360.277,398.074 359.827,395.98 359.185,394.073 C358.37,391.987 315.764,261.152 315.764,261.152 C315.764,261.152 426.688,180.111 429.508,178.204 C434.051,175.019 437.05,169.661 437.05,163.574 C437.05,153.857 429.508,145.402 419.783,145.402 L278.961,145.402 L235.892,12.935 C233.81,5.482 227.081,0.034 219,0.034 C210.909,0.034 204.192,5.482 202.098,12.935 Z`
  ];
  const examplesWrapper = document.createElement('div');
  examplesWrapper.classList.add('examples');
  examplesWrapper.classList.add('visuallyhidden');
  this.srcTextElem.parentNode.appendChild(examplesWrapper);

  examples.forEach(item => {
    const control = document.createElement('button');
    control.innerHTML = `<svg><path d='${item}'/></svg>`;
    examplesWrapper.appendChild(control);
    const svg = control.querySelector('svg');
    const path = control.querySelector('path');
    const pathSizes = path.getBBox();
    const viewBox = `0 0 ${pathSizes.width} ${pathSizes.height}`;
    svg.setAttribute('viewBox', viewBox);
    control.classList.add('examples__control');
  })

  examplesWrapper.classList.remove('visuallyhidden');
}

// ------------------------------

PathConverter.prototype.updateView = function () {
  this.demoPath.setAttribute('d', this.coords);
  this.pathSizes = this.demoPath.getBBox();

  // Show initial path
  this.demoClipPathBefore.innerHTML = '';
  this.demoClipPathBefore.appendChild(this.demoPath.cloneNode(true));

  // Normalize coordinates list formating
  const coordsNormalized = normalizePathCoords(this.coords);
  // Collect all cordinates set from char to next char (next char not includes)
  const coordsList = [...coordsNormalized.matchAll(/[a-z][^(a-z)]{1,}/gi)];
  // Convert coordinates to relative
  const coordsTransformed = this.transformCoords(coordsList);

  let resultPath = coordsTransformed.join(', ');
  resultPath += ' Z';

  this.demoClipPathAfter.innerHTML = '';

  if(resultPath.includes('Infinity')) {
    this.resultTextElem.value = 'Source path is not correct';
  }
  else {
    const pathAfter = this.demoClipPathAfter.appendChild(this.demoPath.cloneNode(true));
    pathAfter.setAttribute('d', resultPath);

    this.resultTextElem.value = resultPath;
  }
}

// ------------------------------

PathConverter.prototype.transformCoords = function (coordsList) {
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

  const coordsTransformed = coordsList.map(item => {
    let value = item[0];
    const itemCommandSrc = value.substring(0,1);
    const itemCommand = itemCommandSrc.toLowerCase();
    const itemCoords = value.substring(1).replace(/,$/,'');

    if(keysListByCommand[itemCommand]) {
      const transformedValsList = this.transformValuesByKeys(keysListByCommand[itemCommand], itemCoords)
      value = `${itemCommandSrc}${transformedValsList.join(',')}`;
    }
    else {
      console.log('Unrecognized command: ', itemCommand);
    }
    return value;
  });

  return coordsTransformed;
}

// ------------------------------

PathConverter.prototype.transformValuesByKeys = function (keysList, coords) {
  const valuesList = coords.split(',');
  const transformedValuesList = valuesList.map((item, index) => {
    if(!isFinite(item)) {
      console.log('not finite item:', item);
      return '';
    }
    if(!keysList[index]) {
      console.log('keysList[index]', keysList[index], index);
      console.log(coords);
      console.log(valuesList);
      return '';
    }
    if(keysList[index].includes('rotation')|| keysList[index].includes('flag')) {
      return item;
    }
    else if(keysList[index].includes('x')) {
      return item/this.pathSizes.width;
    }
    else if(keysList[index].includes('y')) {
      return item/this.pathSizes.height;
    }

    return item;
  });

  return transformedValuesList;
}

// ------------------------------

function normalizePathCoords(coords) {
  console.log(coords);
  let result = coords
    .replace(/([a-z]) /gi, '$1')
    .replace(/([a-z])/gi, ' $1')
    .trim()
    .replace(/\d(-)/gi, ' $1')
    .replace(/,\s{1,}/gi, ',')
    .replace(/\s{1,},/gi, ',')
    .replace(/\s{1,}/gi, ',');

    console.log(result);

  return result;
}
