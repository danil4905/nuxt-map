'use strict';

const {writeFile, copyFile} = require('fs/promises');
const path = require('path');

const {
  CONFIG_TEMPLATE_DB,
  Mode
} = require('../constants')

const init = async () => {
  const env = CONFIG_TEMPLATE_DB;
  const modes = Object.values(Mode);
  const config = {};

  modes.forEach((mode) => {
    return config[mode] = env;
  });


  try {
    await copyFile(
      path.join(path.dirname(__dirname), '/../.env.example'),
      path.join(path.dirname(__dirname), '/../.env')
    );

    await writeFile(
      path.join(path.dirname(__dirname), '/../config/config.json'),
      JSON.stringify(config, null, 2),
      'utf-8'
    );
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  name: `--init`,
  run() {
    init();
  }
};
