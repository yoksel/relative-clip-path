'use strict';

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

const examples = {
  dev: [
    `M 20, 20 h100 v100 h-100 v-100`,
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
    `M-2.068 13.842 c.61-3.7.54-10.906 4.9-13.41C5.85-1.301 9.713-.95 12.888-2.375c4.495-2.018 20.803-14.593 24.675-2.077C42.67 12.056 11.648 19.04 5.41 23.343.868 26.476-.92 32.757-5.567 35.733-11.095 39.277-11 34.226-8.1 25.465c1.119-3.379 3.593-6.145 5.39-9.218l.641-2.404M60.637-5.517C57.199.635 55.488 8.145 50.322 12.94c-4.752 4.41-12.284 4.39-17.862 7.694-2.756 1.632-3.927 5.303-6.722 6.866C7.888 37.48 9.797 31.064-.201 43.94c-3.65 4.7-11.087 11.117-4.483 18.219C8.88 76.745 25.297 43.233 34.62 36.065c6.454-4.961 15.45 2.875 21.287-2.523 4.028-3.726 16.31-31.022 16.796-31.317 3.268-1.983 7.906 1.428 11.469.042 1.42-.552 1.063-3.34.16-4.566-1.572-2.13-4.291-3.158-6.688-4.28-5.273-2.469-7.166-1.577-12.856-1.187l-4.152 2.25m26.23 11.94c-4.02 10.025-6.343 15.697-6.967 17.017-7.364 15.555-16.236 12.045-29.24 17.303-5.971 2.414-13.054 5.302-20.772 12.712-5.713 5.485-10.439 11.97-16.356 17.234-1.056.94-32.052 12.4-15.503 19.463 28.385 12.116 48.63-5.97 69.156-23.08 10.697-8.918 19.352-11.049 25.972-23.488 6.448-12.117 20.54-32.072 8.968-45.586-.47-.548 9.656 2.11-2.102-.53-7.839-1.76-12.224 1.225-13.156 8.955m20.918 33.558c-17.304 6.067-9.489 32.207-22.927 41.13-7.084 4.703-15.023 8.21-23.146 10.726-12.302 3.81-25.412 4.51-37.768 8.14-4.412 1.297-10.616 2.194-12.153 6.528-1.045 2.946 6.079 1.692 9.203 1.793 5.958.191 11.971.005 17.86-.922 21.751-3.424 2.407-3.568 23.942-11.005 18.237-6.297 15.973 2.3 32.313-15.927 5.787-6.454 24.376-27.448 15.073-37.41l-2.397-3.053m-7.426 47.405c-3.55 3.957-15.246 9.203-10.648 11.87l-1.446 6.479c2.938 1.705 26.775-3.52 21.259-10.682-2.214-2.874-5.65-4.552-8.475-6.828l-.69-.84z`,
    `M89.118.892l23.177 83.96 62.052-61.123.657 87.098 75.757-42.98-21.908 84.3 84.3-21.908-42.98 75.757 87.098.657-61.123 62.052 83.96 23.177-75.1 44.118 75.1 44.118-3.195.882H0V4.087L.882.892 45 75.992z`,
  ],
  prod: [
    `M281.5 0L563 563H0z`,
    `M276.5 444.707l-170.752 80.812 24.093-187.367L.218 200.731l185.642-34.987L276.5 0l90.64 165.744 185.642 34.987-129.623 137.421 24.093 187.367z`,
    `M269 0l190.212 78.788L538 269l-78.788 190.212L269 538 78.788 459.212 0 269 78.788 78.788z`,
    `M381.5 585.822L279.396 762.558l-.057-204.11-176.793 102.006L204.552 483.66l-204.11-.057L177.178 381.5.442 279.396l204.11-.057-102.006-176.793L279.34 204.552l.057-204.11L381.5 177.178 483.604.442l.057 204.11 176.793-102.006L558.448 279.34l204.11.057L585.822 381.5l176.736 102.104-204.11.057 102.006 176.793L483.66 558.448l-.057 204.11z`,
    `M32 18.451l-16-12.42-16 12.42v-5.064l16-12.42 16 12.42zM28 18v12h-8v-8h-8v8h-8v-12l12-9z`,
    `M15 0v0c8.284 0 15 5.435 15 12.139s-6.716 12.139-15 12.139c-0.796 0-1.576-0.051-2.339-0.147-3.222 3.209-6.943 3.785-10.661 3.869v-0.785c2.008-0.98 3.625-2.765 3.625-4.804 0-0.285-0.022-0.564-0.063-0.837-3.392-2.225-5.562-5.625-5.562-9.434 0-6.704 6.716-12.139 15-12.139zM31.125 27.209c0 1.748 1.135 3.278 2.875 4.118v0.673c-3.223-0.072-6.181-0.566-8.973-3.316-0.661 0.083-1.337 0.126-2.027 0.126-2.983 0-5.732-0.805-7.925-2.157 4.521-0.016 8.789-1.464 12.026-4.084 1.631-1.32 2.919-2.87 3.825-4.605 0.961-1.84 1.449-3.799 1.449-5.825 0-0.326-0.014-0.651-0.039-0.974 2.268 1.873 3.664 4.426 3.664 7.24 0 3.265-1.88 6.179-4.82 8.086-0.036 0.234-0.055 0.474-0.055 0.718z`,
    `M12 0l-12 16h12l-8 16 28-20h-16l12-12z`,
    `M31.604 4.203c-3.461-2.623-8.787-4.189-14.247-4.189-6.754 0-12.257 2.358-15.099 6.469-1.335 1.931-2.073 4.217-2.194 6.796-0.108 2.296 0.278 4.835 1.146 7.567 2.965-8.887 11.244-15.847 20.79-15.847 0 0-8.932 2.351-14.548 9.631-0.003 0.004-0.078 0.097-0.207 0.272-1.128 1.509-2.111 3.224-2.846 5.166-1.246 2.963-2.4 7.030-2.4 11.931h4c0 0-0.607-3.819 0.449-8.212 1.747 0.236 3.308 0.353 4.714 0.353 3.677 0 6.293-0.796 8.231-2.504 1.736-1.531 2.694-3.587 3.707-5.764 1.548-3.325 3.302-7.094 8.395-10.005 0.292-0.167 0.48-0.468 0.502-0.804s-0.126-0.659-0.394-0.862z`,

    `M31 16l-15-15v9h-16v12h16v9z`,

    `M 0 0 C 130,0 130,130 0,130`,
    'M0 0c4.255 136.009 8.278 212.553 12.07 229.633 4.147 18.678 7.825 103.926 65.305 103.926 57.48 0 82.23-25.727 69.855-100.141s-17.414-105.914 41.024-105.914c58.437 0 35.827 89.276 30.43 107.129-15.67 51.827-30.43 154.945 34.535 163.484 64.965 8.54 73.97-46.797 75.738-86.5 1.717-38.571-18.478-164.61 35.828-164.61 56.871 0 70.925 63.998 51.457 116.333-41.035 110.316-19.335 193.898 63.137 193.898 58.195 0 88.983-73.722 92.363-221.168L580.578 0H0z',
    `M1.335-.013l13.688 32.028 27.425-21.472 9.566 33.49 29.9-17.865 5.293 34.426 31.902-13.977.937 34.818 33.403-9.868-3.434 34.66 34.376-5.604-7.751 33.957 34.808-1.251-11.947 32.717 34.69 3.121-15.952 30.963 34.025 7.444-19.707 28.719 32.824 11.65-23.151 26.022 31.105 15.672-26.23 22.916L276 332l-28.896 19.447 26.23 22.916-31.104 15.672 23.151 26.022-5.475 1.943H0V1.333z`,
  ]
};

const PathConverter = function (params) {
  this.srcTextElem = params.srcTextElem;
  this.resultTextElem = params.resultTextElem;
  const demoTargetElem = params.demoTargetElem;
  const removeOffsetControl = document.getElementById('remove-offsets-control');

  this.fullCodes = {
    spaces: {},
    path: document.querySelector('.full-codes__result path'),

    css: document.querySelector('.full-codes__result style'),
    svg: document.querySelector('.full-codes__result svg'),
    html: document.querySelector('.full-codes__result div'),

    cssCode: document.querySelector('.full-codes__css-code'),
    htmlCode: document.querySelector('.full-codes__html-code'),
  };

  this.fullCodes.cssCode.value = this.removeStartSpaces(this.fullCodes.css.innerHTML, 'css');

  this.isRemoveOffset = removeOffsetControl.checked;
  this.isDebug = location.search.includes('debug');
  this.lastUsedCoords = {};

  // Add examples if needed

  const isAddExamples = params.addExamples;
  this.examples = examples.prod;

  if(isAddExamples) {
    this.addExamples();
  }

  // Prepare DOM

  const demosTmpl = document.getElementById('demos-tmpl');
  demoTargetElem.appendChild(demosTmpl.content.cloneNode(true));

  const demoSVG = demoTargetElem.querySelector('.src-container svg');
  this.demoPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  demoSVG.appendChild(this.demoPath);

  this.demoClipPathBefore = demoTargetElem.querySelector('#clip-path-before');
  this.demoClipPathAfter = demoTargetElem.querySelector('#clip-path-after');

  // Add demo code

  const randExamplePos = Math.floor(Math.random() * this.examples.length);
  const randomExample = this.examples[randExamplePos];

  this.srcTextElem.value = randomExample;
  this.coords = randomExample;

  // Actions

  this.updateView();

  this.srcTextElem.addEventListener('input', () => {
    this.coords = this.srcTextElem.value;
    this.updateView();
  })

  removeOffsetControl.addEventListener('change', () => {
    this.isRemoveOffset = removeOffsetControl.checked;
    this.updateView();
  });
}



// ---------------------------------------------
// Add examples
// ---------------------------------------------

PathConverter.prototype.addExamples = function () {
  const examplesWrapper = document.createElement('div');
  examplesWrapper.classList.add('examples');
  const examplesContainer = document.createElement('div');
  examplesContainer.classList.add('examples__container');
  examplesWrapper.appendChild(examplesContainer);

  examplesWrapper.classList.add('visuallyhidden');
  this.srcTextElem.parentNode.appendChild(examplesWrapper);

  this.examples.forEach(item => {
    const control = document.createElement('button');
    control.innerHTML = `<svg><path d='${item}'/></svg>`;
    examplesContainer.appendChild(control);
    const svg = control.querySelector('svg');
    const path = control.querySelector('path');
    const pathSizes = path.getBBox();
    const viewBox = `0 0 ${pathSizes.width} ${pathSizes.height}`;
    svg.setAttribute('viewBox', viewBox);
    control.classList.add('examples__control');

    control.addEventListener('click', () => {
      this.srcTextElem.value = item;
      this.coords = this.srcTextElem.value;
      this.updateView();
    });
  })

  examplesWrapper.classList.remove('visuallyhidden');
}



// ---------------------------------------------
// Update view
// ---------------------------------------------

PathConverter.prototype.updateView = function () {
  this.demoPath.setAttribute('d', this.coords);
  this.pathSizes = this.demoPath.getBBox();

  // Show initial path
  this.demoClipPathBefore.innerHTML = '';
  this.demoClipPathBefore.appendChild(this.demoPath.cloneNode(true));

  // Normalize coordinates list formating
  const coordsNormalized = normalizePathCoords(this.coords);
  // Collect all cordinates set from char to next char (next char not includes)
  const coordsListSrc = [...coordsNormalized.matchAll(/[a-z][^(a-z)]{1,}/gi)]
    .map(item => item[0]);
  let coordsList = coordsListSrc.slice();
  // Add ommited commands for more correct parsing
  coordsList = this.addOmmitedCommands(coordsListSrc.slice());

  if(this.isRemoveOffset) {
    // Remove path offset
    coordsList = this.removeOffset(coordsList);
  }

  // Convert coordinates to relative
  const coordsTransformed = this.transformCoords(coordsList);

  let resultPath = coordsTransformed.join(', ');
  this.demoClipPathAfter.innerHTML = '';

  if(resultPath.includes('Infinity')) {
    this.resultTextElem.value = 'Source path is not correct';
    return;
  }

  const pathAfter = this.demoClipPathAfter.appendChild(this.demoPath.cloneNode(true));
  pathAfter.setAttribute('d', resultPath);
  this.resultTextElem.value = resultPath;

  this.fullCodes.path.setAttribute('d', resultPath);

  const svgOutputCode = this.removeStartSpaces(this.fullCodes.svg.outerHTML, 'svg');
  const htmlOutputCode = this.removeStartSpaces(this.fullCodes.html.outerHTML, 'html');
  this.fullCodes.htmlCode.value = `${svgOutputCode}\n\n${htmlOutputCode}`;
}



// ---------------------------------------------
// Add ommitted command letters for easy parisng
// ---------------------------------------------

PathConverter.prototype.addOmmitedCommands = function (srcCoordsList) {
  srcCoordsList = srcCoordsList.slice();
  const coordsFixed = [];
  const max = 5000;
  let counter = 0;
  const handledCommands = {
    'a': true,
    't': true,
    'c': true,
    's': true,
    'q': true,
  }

  while(srcCoordsList.length > 0 && counter < max) {
    let value = srcCoordsList.shift();
    let {commandSrc, command, coordsList, keysList} = parseCoordsItem(value);

    if(keysList) {
      let coords;

      if(handledCommands[command] && coordsList.length > keysList.length) {
        // Fix problem with long commands A
        const cuttedTail = coordsList.splice(keysList.length);
        coords = coordsList.join(',');

        if(cuttedTail.length % keysList.length === 0) {
          // Move part of command to the next item
          cuttedTail[0] = `${commandSrc}${cuttedTail[0]}`;
          srcCoordsList.unshift(cuttedTail.join(','));
        }
        else {
          console.log('\nCommand is broken, check params:', coordsList);
        }
      }
      else {
        coords = coordsList.join(',');
      }

      value = `${commandSrc}${coords}`;
    }
    else {
      console.log('Unrecognized command: ', command);
    }

    coordsFixed.push(value);
    counter++;
  }

  return coordsFixed;
}



// ---------------------------------------------
// Translate relative commands to absolute
// (l -> L, a -> A, ...)
// ---------------------------------------------

PathConverter.prototype.relCommandsToAbs = function(initialCoordsList) {
  initialCoordsList = initialCoordsList.slice();

  const coordsAbs = initialCoordsList.reduce((prev, value, index) => {
    let {commandSrc, command, coordsList, keysList, isCommandUpperCase} = parseCoordsItem(value);

    if(command === 'm') {
      const [x, y] = coordsList;
      this.lastUsedCoords.x = x;
      this.lastUsedCoords.y = y;
    }

    if(!isCommandUpperCase) {
      const prevCoords = prev[index - 1];
      const absItemCoords = this.relItemCoordToAbs(keysList, coordsList, prevCoords, command);
      value = `${commandSrc.toUpperCase()}${absItemCoords.join(',')}`;
    }

    prev.push(value);

    return prev;
  }, []);

  return coordsAbs;
}

// ---------------------------------------------

PathConverter.prototype.relItemCoordToAbs = function (keysList, coordsList, prevCoords, itemCommand) {
  const valuesList = coordsList;
  const prevCoordsData = parseCoordsItem(prevCoords);
  const prevCoordsList = prevCoordsData.coordsList;
  let [prevX, prevY] = prevCoordsList.splice(-2);

  if(prevCoordsData.command === 'v') {
    prevY = prevX;
    prevX = this.lastUsedCoords.x;
  }
  else if(prevCoordsData.command === 'h') {
    prevY = this.lastUsedCoords.y;
  }

  const transformedValuesList = valuesList.map((item, index) => {
    const key = keysList[index];

    if(!isFinite(item)) {
      console.log('Not finite item:', item);
      return item;
    }

    if(key && (key.includes('rotation')
      || key.includes('flag')
      || key === 'rx'
      || key === 'ry')) {
      return item;
    }

    if(!key && itemCommand !== 'a') {
      // Commands can use more than two coords
      if(index % 2 == 0) {
        // x
        const newX = item + prevX;
        if(itemCommand === 'l') {
          prevX = newX;
        }
        this.lastUsedCoords.x = newX;
        return newX;
      }
      else {
        // y
        const newY = item + prevY;
        if(itemCommand === 'l') {
          prevY = newY;
        }
        this.lastUsedCoords.y = newY;
        return newY;
      }
    }

    if(key.includes('x')) {
      const newX = item + prevX;
      if(itemCommand === 'l') {
        prevX = newX;
      }
      this.lastUsedCoords.x = newX;
      return newX;
    }

    if(key.includes('y')) {
      const newY = item + prevY;
      if(itemCommand === 'l') {
        prevY = newY;
      }
      this.lastUsedCoords.y = newY;
      return newY;
    }

    return item;
  });

  return transformedValuesList;
}



// ---------------------------------------------
// Removing path offset
// ---------------------------------------------

PathConverter.prototype.removeOffset = function (srcCoordsList) {
  // Find minimal value
  srcCoordsList = srcCoordsList.slice();
  // Make easier to get offset
  const absCoordsList = this.relCommandsToAbs(srcCoordsList.slice());

  srcCoordsList = absCoordsList;
  this.minXY = this.findOffset(absCoordsList);
  const coordsWithoutOffset = [];

  const max = 5000;
  let counter = 0;

  while(srcCoordsList.length > 0 && counter < max) {
    let value = srcCoordsList.shift();
    let {commandSrc, command, coordsList, keysList, isCommandUpperCase} = parseCoordsItem(value);

    if(keysList) {
      if(isCommandUpperCase) {
        const transformedValsList = this.removeOffsetFromValues(keysList, coordsList, command)
        value = `${commandSrc}${transformedValsList.join(',')}`;
      }

      coordsWithoutOffset.push(value);
    }
    else {
      console.log('Unrecognized command: ', command);
    }
    counter++;
  }

  return coordsWithoutOffset;
}

// ---------------------------------------------

PathConverter.prototype.removeOffsetFromValues = function (keysList, coordsList, itemCommand) {
  const valuesList = coordsList;

  const transformedValuesList = valuesList.map((item, index) => {
    if(!keysList[index] && itemCommand !== 'a') {
      // L lets use more than two coords
      if(index % 2 == 0) {
        // x
        return round(item - this.minXY.x);
      }
      else {
        // y
        return round(item - this.minXY.y);
      }
    }

    if(keysList[index].includes('rotation')
      || keysList[index].includes('flag')
      || keysList[index] === 'rx'
      || keysList[index] === 'ry') {
      return item;
    }

    if(keysList[index].includes('x')) {
      return round(item - this.minXY.x);
    }

    if(keysList[index].includes('y')) {
      return round(item - this.minXY.y);
    }

    return item;
  });

  return transformedValuesList;
}

// ---------------------------------------------

PathConverter.prototype.findOffset = function (srcCoordsList) {
  // Find minimal value
  srcCoordsList = srcCoordsList.slice();
  let minXY = { x: null, y: null};
  const max = 5000;
  let counter = 0;

  while(srcCoordsList.length > 0 && counter < max) {
    let value = srcCoordsList.shift();
    let {commandSrc, command, coordsList, keysList, isCommandUpperCase} = parseCoordsItem(value);

    if(!isCommandUpperCase) {
      continue;
    }

    if(command == 'm' && minXY.x === null) {
      const [x, y] = coordsList;
      minXY = {x, y};

      // For correct handling v & h
      this.lastUsedCoords = {x, y};
      continue;
    }

    const itemMinXY = this.findItemMinXY(keysList, coordsList, command);

    if(itemMinXY.x >= 0 && itemMinXY.x < minXY.x) {
      minXY.x = itemMinXY.x;
    }
    if(itemMinXY.y >= 0 && itemMinXY.y < minXY.y) {
      minXY.y = itemMinXY.y;
    }

    counter++;
  }

  return minXY;
}

// ---------------------------------------------

PathConverter.prototype.findItemMinXY = function(keysList, coordsList, itemCommand) {
  let valuesList = coordsList;
  let minXY = {x: null, y: null};
  const max = 10000;
  let counter = 0;

  // Handling short paths
  if(itemCommand === 'v') {
    valuesList = [
      this.lastUsedCoords.x,
      valuesList[0]
    ]
  }
  else if(itemCommand === 'h') {
    valuesList = [
      valuesList[0],
      this.lastUsedCoords.y
    ]
  }
  else if(itemCommand === 'a') {
    valuesList = valuesList.splice(-2);
  }

  if(valuesList.length === 2) {
    const [x, y] = valuesList;
    minXY = {x, y};

    this.lastUsedCoords = {x, y};

    return minXY;
  }

  // Handling long paths
  while(valuesList.length > 0 && counter < max) {
    let [x, y] = valuesList.splice(0,2);
    if(minXY.x === null) {
      minXY = {x, y};

      continue;
    }

    if(x >= 0 && x < minXY.x) {
      minXY.x = x;
    }
    if(y >= 0 && y < minXY.y) {
      minXY.y = y;
    }

    counter++;
  }

  return minXY;
}



// ---------------------------------------------
// Transforming coordinats from userSpaceOnUse
// coordinate system to objectBoundingBox
// ---------------------------------------------

// M281.5 0L563 563H0z -> M0.5,0, L1,1, H0
PathConverter.prototype.transformCoords = function (srcCoordsList) {
  srcCoordsList = srcCoordsList.slice();
  const coordsTransformed = [];
  const max = 5000;
  let counter = 0;

  while(srcCoordsList.length > 0 && counter < max) {
    let value = srcCoordsList.shift();
    let {commandSrc, command, coordsList, keysList} = parseCoordsItem(value);

    if(keysList) {
      const transformedValsList = this.transformValuesByKeys(keysList, coordsList, command)
      value = `${commandSrc}${transformedValsList.join(',')}`;
    }
    else {
      console.log('Unrecognized command: ', command);
    }

    coordsTransformed.push(value);
    counter++;
  }

  return coordsTransformed;
}

// ---------------------------------------------

PathConverter.prototype.transformValuesByKeys = function (keysList, coordsList, itemCommand) {
  const valuesList = coordsList;

  const transformedValuesList = valuesList.map((item, index) => {
    if(!keysList[index] && itemCommand !== 'a') {
      // L lets use more than two coords
      if(index % 2 == 0) {
        return item/this.pathSizes.width;
      }
      else {
        return item/this.pathSizes.height;
      }
    }

    if(keysList[index].includes('rotation')|| keysList[index].includes('flag')) {
      return item;
    }

    if(keysList[index].includes('x')) {
      return item/this.pathSizes.width;
    }

    if(keysList[index].includes('y')) {
      return item/this.pathSizes.height;
    }

    return item;
  });

  return transformedValuesList;
}



// ---------------------------------------------
// Removing start spaces from output codes
// ---------------------------------------------

PathConverter.prototype.removeStartSpaces = function (str, key) {
  str = str.trim();
  let minSpace = this.fullCodes.spaces[key];

  if(minSpace === undefined) {
    minSpace = findMinSpaces(str);
    this.fullCodes.spaces[key] = minSpace;
  }

  const regexp = new RegExp(`^\\s{${minSpace}}`,'gm');

  return str.replace(regexp,'');
}



// ---------------------------------------------
// Helpers
// ---------------------------------------------

function findMinSpaces(str) {
  const spaces = str
    .match(/(^\s{1,})/gm);

  if(!spaces) {
    return 0;
  }
  const minSpace = spaces
    .reduce((prev, item) => {
      const spacesLength = item.length;
      if(prev == null || spacesLength < prev) {
        prev = spacesLength;
        return prev;
      }

      return prev;
    }, null);

  return minSpace;
}

// ---------------------------------------------

function parseCoordsItem(item) {
  const commandSrc = item.substring(0,1);
  const command = commandSrc.toLowerCase();
  const isCommandUpperCase = command !== commandSrc;
  const keysList = keysListByCommand[command];
  let coordsList = item
    .substring(1)
    .replace(/,$/,'')
    .split(',')
    .map(item => +item);

  return {
    commandSrc,
    command,
    isCommandUpperCase,
    keysList,
    coordsList
  }
}

// ---------------------------------------------

function normalizePathCoords(coords) {
  let result = coords
    .replace(/([a-z]) /gi, '$1')
    .replace(/([a-z])/gi, ' $1')
    .trim()

    .replace(/(\d{1,})(-)/gi, '$1 $2')
    .replace(/(\d{1,}\.\d{1,})(\.\d{1,})/gi, '$1 $2')
    .replace(/\s00/gi, ' 0 0 ')
    .replace(/z/gi, ' ')

    .replace(/,\s{1,}/gi, ',')
    .replace(/\s{1,},/gi, ',')
    .replace(/\s{1,}/gi, ',');

  return result;
}

// ---------------------------------------------

function round(num) {
  return Math.round(num * 1000) / 1000;
}
