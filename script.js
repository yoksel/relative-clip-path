'use strict';

const PathConverter = function (params) {
  this.keysListByCommand = {
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

  this.srcTextElem = params.srcTextElem;
  this.resultTextElem = params.resultTextElem;
  const demoTargetElem = params.demoTargetElem;
  const removeOffsetControl = document.getElementById('remove-offsets-control');
  this.isRemoveOffset = removeOffsetControl.checked;

  const addExamples = params.addExamples;

  const demosTmpl = document.getElementById('demos-tmpl');
  demoTargetElem.appendChild(demosTmpl.content.cloneNode(true));

  const demoSVG = demoTargetElem.querySelector('.src-container svg');
  this.demoPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  demoSVG.appendChild(this.demoPath);

  this.demoClipPathBefore = demoTargetElem.querySelector('#clip-path-before');
  this.demoClipPathAfter = demoTargetElem.querySelector('#clip-path-after');

  this.srcTextElem.value = `M202.098 12.935l-42.882 132.467H18.392c-9.724 0-17.442 8.456-17.442 18.26a17.78 17.78 0 007.54 14.542c2.814 1.907 113.747 82.948 113.747 82.948S79.632 391.987 78.806 394.073c-.63 1.907-1.083 4.001-1.083 6.175 0 9.813 7.897 17.718 17.622 17.718 3.726 0 7.178-1.181 10.087-3.175L219 319.106s112.717 95.076 113.569 95.685c2.899 1.994 6.361 3.175 10.078 3.175 9.725 0 17.63-7.994 17.63-17.718 0-2.174-.45-4.268-1.092-6.175-.815-2.086-43.421-132.921-43.421-132.921s110.924-81.041 113.744-82.948c4.543-3.185 7.542-8.543 7.542-14.63 0-9.717-7.542-18.172-17.267-18.172H278.961L235.892 12.935C233.81 5.482 227.081.034 219 .034c-8.091 0-14.808 5.448-16.902 12.901z`;
  // this.srcTextElem.value = `M202.098 12.935l-42.882 132.467
  // H18.392
  // c-9.724 0-17.442 8.456-17.442 18.26
  // a17.78 17.78 0 007.54 14.542

  //   S79.632 391.987 78.806 394.073

  //   c2.899 1.994 6.361 3.175 10.078 3.175 9.725 0 17.63-7.994 17.63-17.718 0-2.174-.45-4.268-1.092-6.175-.815-2.086-43.421-132.921-43.421-132.921s110.924-81.041 113.744-82.948c4.543-3.185 7.542-8.543 7.542-14.63 0-9.717-7.542-18.172-17.267-18.172
  //     H278.961L235.892 12.935C233.81 5.482 227.081.034 219 .034c-8.091 0-14.808 5.448-16.902 12.901z`;

  this.coords = this.srcTextElem.value;

  if(addExamples) {
    this.addExamples();
  }

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
    `M202.098,12.935 L159.216,145.402 L18.392,145.402 C8.668,145.402 0.95,153.858 0.95,163.662,C0.947773812,169.447353 3.7604707,174.872053 8.49,178.204 C11.304,180.111 122.237,261.152 122.237,261.152 C122.237,261.152 79.632,391.987 78.806,394.073 C78.176,395.98 77.723,398.074 77.723,400.248 C77.723,410.061 85.62,417.966 95.345,417.966 C99.071,417.966 102.523,416.785 105.432,414.791 L219,319.106 C219,319.106 331.716805,414.181811 332.569,414.791 C335.468,416.785 338.93,417.966 342.647,417.966 C352.372,417.966 360.277,409.972 360.277,400.248 C360.277,398.074 359.827,395.98 359.185,394.073 C358.37,391.987 315.764,261.152 315.764,261.152 C315.764,261.152 426.688,180.111 429.508,178.204 C434.051,175.019 437.05,169.661 437.05,163.574 C437.05,153.857 429.508,145.402 419.783,145.402 L278.961,145.402 L235.892,12.935 C233.81,5.482 227.081,0.034 219,0.034 C210.909,0.034 204.192,5.482 202.098,12.935 Z`,
    `M7.99323063,23.770569 C8.60245134,20.0708435 8.53218102,12.8641513 12.8934239,10.3601081 C15.9115021,8.62725394 19.7744592,8.97804242 22.9494727,7.55295706 C27.4441628,5.535543 43.7516951,-7.04013222 47.6239609,5.47634294 C52.731012,21.9840626 21.7088874,28.9687522 15.471095,33.2711428 C10.9288073,36.4040934 9.14028003,42.6854149 4.49404599,45.6620348 C-1.03436165,49.2038212 -0.938687985,44.1537511 1.96206556,35.3924208 C3.08079829,32.0134412 5.55502725,29.2469435 7.35150809,26.1742049 L7.99323063,23.770569 M70.6977364,4.41159691 C67.2596437,10.5637481 65.5491376,18.0737618 60.3834584,22.8680504 C55.6315892,27.2782803 48.0991473,27.258854 42.5209833,30.5625603 C39.7651304,32.1947332 38.5944055,35.8653508 35.7988114,37.428478 C17.9490101,47.409008 19.857998,40.9919261 9.86038652,53.8683826 C6.21096363,58.5686688 -1.22735803,64.9849949 5.3770562,72.0871421 C18.9408468,86.6731497 35.3585815,53.1614065 44.6823048,45.9936771 C51.1364604,41.0319638 60.1329559,48.8681695 65.9690113,43.4699107 C69.9966433,39.7444149 82.2787377,12.4481425 82.7646869,12.1533376 C86.0333725,10.1703638 90.6710973,13.5817062 94.2340654,12.1954346 C95.6535018,11.6431635 95.2975595,8.85448172 94.3932126,7.62893701 C92.8219413,5.49959562 90.1030858,4.47155466 87.7064638,3.34941777 C82.4334641,0.880514665 80.539776,1.77258609 74.8504512,2.16197439 L70.6977364,4.41159691 M96.9277599,16.3522565 C92.9078684,26.3769576 90.5855173,32.0492714 89.9607067,33.369198 C82.5975387,48.9240574 73.7246823,45.4144317 60.7207478,50.672091 C54.7500663,53.086115 47.6666348,55.974047 39.9489594,63.3843578 C34.2361397,68.8696584 29.510349,75.3541674 23.5932488,80.6184582 C22.5372959,81.5579121 -8.45929709,93.0182861 8.0897457,100.081646 C36.4748498,112.1968 56.7191748,94.1105247 77.2458731,77.0006832 C87.9435658,68.0837193 96.5980404,65.9526569 103.218181,53.513125 C109.666608,41.3962511 123.758307,21.4409352 112.186382,7.92772303 C111.716327,7.37881255 121.842509,10.0382201 110.084099,7.3979169 C102.245158,5.63771477 97.8597122,8.62249462 96.9277599,16.3522565 M117.845861,49.910238 C100.541813,55.9776829 108.357271,82.1176539 94.9194251,91.0395188 C87.8348844,95.7431978 79.8958511,99.2504958 71.7727499,101.766553 C59.470996,105.576909 46.3611129,106.276742 34.0050686,109.907188 C29.5932177,111.203475 23.3887676,112.100371 21.8518705,116.434276 C20.8073182,119.379816 27.9310345,118.126499 31.054685,118.226992 C37.0131748,118.418688 43.0265462,118.231873 48.91562,117.304965 C70.6664864,113.881499 51.3221005,113.737218 72.8570043,106.300707 C91.0940678,100.003019 88.8296239,108.600788 105.170558,90.3736674 C110.957207,83.9190822 129.545777,62.9256087 120.242823,52.9638105 L117.845861,49.910238 M110.420361,97.3150518 C106.871037,101.271827 95.1746101,106.518129 99.7723876,109.185379 L98.3256883,115.664209 C101.264056,117.368807 125.100756,112.143405 119.584672,104.981839 C117.371078,102.107916 113.935118,100.429887 111.110341,98.1539115 L110.420361,97.3150518 Z`,
    `M-2.068 13.842 c.61-3.7.54-10.906 4.9-13.41C5.85-1.301 9.713-.95 12.888-2.375c4.495-2.018 20.803-14.593 24.675-2.077C42.67 12.056 11.648 19.04 5.41 23.343.868 26.476-.92 32.757-5.567 35.733-11.095 39.277-11 34.226-8.1 25.465c1.119-3.379 3.593-6.145 5.39-9.218l.641-2.404M60.637-5.517C57.199.635 55.488 8.145 50.322 12.94c-4.752 4.41-12.284 4.39-17.862 7.694-2.756 1.632-3.927 5.303-6.722 6.866C7.888 37.48 9.797 31.064-.201 43.94c-3.65 4.7-11.087 11.117-4.483 18.219C8.88 76.745 25.297 43.233 34.62 36.065c6.454-4.961 15.45 2.875 21.287-2.523 4.028-3.726 16.31-31.022 16.796-31.317 3.268-1.983 7.906 1.428 11.469.042 1.42-.552 1.063-3.34.16-4.566-1.572-2.13-4.291-3.158-6.688-4.28-5.273-2.469-7.166-1.577-12.856-1.187l-4.152 2.25m26.23 11.94c-4.02 10.025-6.343 15.697-6.967 17.017-7.364 15.555-16.236 12.045-29.24 17.303-5.971 2.414-13.054 5.302-20.772 12.712-5.713 5.485-10.439 11.97-16.356 17.234-1.056.94-32.052 12.4-15.503 19.463 28.385 12.116 48.63-5.97 69.156-23.08 10.697-8.918 19.352-11.049 25.972-23.488 6.448-12.117 20.54-32.072 8.968-45.586-.47-.548 9.656 2.11-2.102-.53-7.839-1.76-12.224 1.225-13.156 8.955m20.918 33.558c-17.304 6.067-9.489 32.207-22.927 41.13-7.084 4.703-15.023 8.21-23.146 10.726-12.302 3.81-25.412 4.51-37.768 8.14-4.412 1.297-10.616 2.194-12.153 6.528-1.045 2.946 6.079 1.692 9.203 1.793 5.958.191 11.971.005 17.86-.922 21.751-3.424 2.407-3.568 23.942-11.005 18.237-6.297 15.973 2.3 32.313-15.927 5.787-6.454 24.376-27.448 15.073-37.41l-2.397-3.053m-7.426 47.405c-3.55 3.957-15.246 9.203-10.648 11.87l-1.446 6.479c2.938 1.705 26.775-3.52 21.259-10.682-2.214-2.874-5.65-4.552-8.475-6.828l-.69-.84z`
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

    control.addEventListener('click', () => {
      this.srcTextElem.value = item;
      this.coords = this.srcTextElem.value;
      this.updateView();
    });
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
  const coordsListSrc = [...coordsNormalized.matchAll(/[a-z][^(a-z)]{1,}/gi)]
    .map(item => item[0]);
  let coordsList = this.addOmmitedCommands(coordsListSrc.slice());

  if(this.isRemoveOffset) {
    coordsList = this.removeOffset(coordsList);
    // console.log('\n\ncoordsList', coordsList)
    // console.log('\n\ncoordsListWithoutOffset', coordsListWithoutOffset)
  }


  // Convert coordinates to relative
  const coordsTransformed = this.transformCoords(coordsList);
  // const coordsTransformed = this.transformCoords(coordsListWithoutOffset);


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

PathConverter.prototype.removeOffset = function (coordsList) {
  // Find minimal value
  coordsList = coordsList.slice();
  this.minXY = this.findOffset(coordsList);
  const coordsWithoutOffset = [];

  const max = 5000;
  let counter = 0;

  while(coordsList.length > 0 && counter < max) {
    let value = coordsList.shift();
    const itemCommandSrc = value.substring(0,1);
    const itemCommand = itemCommandSrc.toLowerCase();
    let itemCoords = value.substring(1).replace(/,$/,'');
    const itemCoordsList = itemCoords.split(',');
    const keysList = this.keysListByCommand[itemCommand];
    const isCommandUpperCase = itemCommand !== itemCommandSrc;

    if(keysList) {
      if(isCommandUpperCase) {
        const transformedValsList = this.removeOffsetFromValues(keysList, itemCoords, itemCommand)
        value = `${itemCommandSrc}${transformedValsList.join(',')}`;
      }

      coordsWithoutOffset.push(value);
    }
    else {
      console.log('Unrecognized command: ', itemCommand);
    }
    counter++;
  }

  return coordsWithoutOffset;
}

// ------------------------------

PathConverter.prototype.removeOffsetFromValues = function (keysList, coords, itemCommand) {
  const valuesList = coords.split(',');

  const transformedValuesList = valuesList.map((item, index) => {
    if(!isFinite(item)) {
      console.log('Not finite item:', item);
      return item;
    }

    if(!keysList[index] && itemCommand !== 'a') {
      // L lets use more than two coords
      if(index % 2 == 0) {
        // x
        return item - this.minXY.x;
      }
      else {
        // y
        return item - this.minXY.y;
      }
    }

    if(keysList[index].includes('rotation')|| keysList[index].includes('flag')) {
      return item;
    }

    if(keysList[index].includes('x')) {
      return item - this.minXY.x;
    }

    if(keysList[index].includes('y')) {
      return item - this.minXY.y;
    }

    return item;
  });

  return transformedValuesList;
}

// ------------------------------

PathConverter.prototype.findOffset = function (coordsList) {
  // Find minimal value
  coordsList = coordsList.slice();
  const minXY = { x: null, y: null};
  const max = 5000;
  let counter = 0;

  while(coordsList.length > 0 && counter < max) {
    let value = coordsList.shift();
    const itemCommandSrc = value.substring(0,1);
    const itemCommand = itemCommandSrc.toLowerCase();
    let itemCoords = value.substring(1).replace(/,$/,'');
    const itemCoordsList = itemCoords.split(',');
    const keysList = this.keysListByCommand[itemCommand];
    const itemMinXY = findItemMinXY(keysList, itemCoordsList, itemCommand);

    if(keysList) {
      if(itemMinXY.x) {
        if(!minXY.x || itemMinXY.x < minXY.x) {
          minXY.x = itemMinXY.x;
        }
      }
      if(itemMinXY.y) {
        if(!minXY.y || itemMinXY.y < minXY.y) {
          minXY.y = itemMinXY.y;
        }
      }
    }
    else {
      console.log('Unrecognized command: ', itemCommand);
    }
    counter++;
  }

  return minXY;
}

// ------------------------------

function findItemMinXY(keysList, valuesList, itemCommand) {
  const minXY = valuesList.reduce((prev, item, index) => {
    item = +item;
    const key = keysList[index];

    if(item < 0) {
      return prev;
    }

    if(!key && itemCommand !== 'a') {
      // L lets use more than two coords
      if(index % 2 == 0) {
        if(item >= 0 && (!prev.x || item < prev.x)) {
          prev.x = item;
        }
      }
      else {
        if(item >= 0 && (!prev.y || item < prev.y)) {
          prev.y = item;
        }
      }
    }

    else if(key.includes('rotation')|| key.includes('flag')) {
      return prev;
    }

    else if(key.includes('x')) {
      if(item >= 0 && (!prev.x || item < prev.x)) {
        prev.x = item;
      }
    }

    else if(key.includes('y')) {
      if(item >= 0 && (!prev.y || item < prev.y)) {
        prev.y = item;
      }
    }

    return prev;
  }, {x: null, y: null});

  return minXY;
}

// ------------------------------

PathConverter.prototype.addOmmitedCommands = function (coordsList) {
  coordsList = coordsList.slice();
  const coordsFixed = [];
  const max = 5000;
  let counter = 0;

  while(coordsList.length > 0 && counter < max) {
    let value = coordsList.shift();
    const itemCommandSrc = value.substring(0,1);
    const itemCommand = itemCommandSrc.toLowerCase();
    let itemCoords = value.substring(1).replace(/,$/,'');
    const itemCoordsList = itemCoords.split(',');
    const keysList = this.keysListByCommand[itemCommand];

    if(keysList) {
      if(itemCommand == 'a' && itemCoordsList.length > keysList.length) {
        // Fix problem with long commands A
        const cuttedTail = itemCoordsList.splice(keysList.length);
        itemCoords = itemCoordsList.join(',')

        if(cuttedTail.length % keysList.length === 0) {
          // Move part of command to the next item
          cuttedTail[0] = `${itemCommandSrc}${cuttedTail[0]}`;
          coordsList.unshift(cuttedTail.join(','));
        }
        else {
          console.log('\ncommand is broken\n');
        }
      }

      value = `${itemCommandSrc}${itemCoords}`;
    }
    else {
      console.log('Unrecognized command: ', itemCommand);
    }

    coordsFixed.push(value);
    counter++;
  }

  return coordsFixed;
}

// ------------------------------

PathConverter.prototype.transformCoords = function (coordsList) {
  coordsList = coordsList.slice();
  const coordsTransformed = [];
  const max = 5000;
  let counter = 0;

  while(coordsList.length > 0 && counter < max) {
    let value = coordsList.shift();
    const itemCommandSrc = value.substring(0,1);
    const itemCommand = itemCommandSrc.toLowerCase();
    let itemCoords = value.substring(1).replace(/,$/,'');
    const keysList = this.keysListByCommand[itemCommand];

    if(keysList) {
      const transformedValsList = this.transformValuesByKeys(keysList, itemCoords, itemCommand)
      value = `${itemCommandSrc}${transformedValsList.join(',')}`;
    }
    else {
      console.log('Unrecognized command: ', itemCommand);
    }

    coordsTransformed.push(value);
    counter++;
  }

  return coordsTransformed;
}

// ------------------------------

PathConverter.prototype.transformValuesByKeys = function (keysList, coords, itemCommand) {
  const valuesList = coords.split(',');

  const transformedValuesList = valuesList.map((item, index) => {
    if(!isFinite(item)) {
      console.log('Not finite item:', item);
      return item;
    }

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

// ------------------------------

function normalizePathCoords(coords) {
  let result = coords
    .replace(/([a-z]) /gi, '$1')
    .replace(/([a-z])/gi, ' $1')
    .trim()
    .replace(/(\d{1,})(-)/gi, '$1 $2')
    .replace(/(\d{1,}\.\d{1,})(\.\d{1,})/gi, '$1 $2')
    .replace(/\s00/gi, ' 0 0 ')

    .replace(/,\s{1,}/gi, ',')
    .replace(/\s{1,},/gi, ',')
    .replace(/\s{1,}/gi, ',');

  return result;
}
