'use strict';

module.exports = {
  require: [require.resolve('./test/setup.js')],
  timeout: process.env.HEADSPIN ? 500000 : 60000,
};
