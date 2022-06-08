'use strict';

const {writeFile, readFile} = require('fs/promises');
const path = require('path');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const init = async () => {
  const places = [
    {
      fileName: '6.svg',
      floor: 6,
      cityId: 1
    },
    {
      fileName: '4.svg',
      floor: 4,
      cityId: 1
    },
    {
      fileName: '7.svg',
      floor: 7,
      cityId: 1
    },
    {
      fileName: '8.svg',
      floor: 8,
      cityId: 1
    },
    {
      fileName: '3.svg',
      floor: 3,
      cityId: 1
    },
    {
      fileName: '2-k.svg',
      floor: 2,
      cityId: 2
    },
    {
      fileName: '3-s.svg',
      floor: 3,
      cityId: 3
    }
  ];

  const result = [];

  try {
    for (const place of places) {

      const file = await readFile(
        path.join(path.dirname(__dirname), '/../api/mocks/svg/' + place.fileName),
        {
          encoding: 'utf-8'
        }
      );

      const doc = new JSDOM(file, {
        contentType: 'text/html',
      });

      const items = doc.window.document.querySelectorAll('svg g');
      items.forEach((item) => {
        const coordsTarget = item.getAttribute('transform');

        if(coordsTarget) {
          const coords = coordsTarget.replace(/translate/gi, '').replace(/\(/gi, '').replace(/\)/gi, '').split(' ');
          result.push({
            floor: place.floor,
            cityId: place.cityId,
            userId: null,
            coords: `translate(${parseInt(coords[0]) * 1.25} ${parseInt(coords[1]) * 1.2})`,
            createdAt: '2022-02-21T13:40:10.429Z',
            updatedAt: '2022-02-21T13:40:10.429Z'
          });
        }
      });

      await writeFile(
        path.join(path.dirname(__dirname), '/../api/mocks/places.json'),
        JSON.stringify(result, null, 2),
        'utf-8'
      );
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  name: `--parse-user`,
  run() {
    init();
  }
};
