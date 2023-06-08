'use strict';

module.exports = {
  require: [require.resolve('./test/setup.js')],
  timeout: process.env.HEADSPIN ? 300000 : 60000,
};
