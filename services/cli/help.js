'use strict';

const chalk = require('chalk')

/**
 * Initialization data-services
 */
const init = () => {
  console.info(chalk.gray(`CLI`));
  console.info(chalk.gray(`  Run: service.js <command>`));
  console.info(chalk.gray(`Commands:
  --help: return instruction
  --init generate configuration file for sequelize-cli (migration:seed:db)`));
};

module.exports = {
  name: `--help`,
  run() {
    init();
  }
};
