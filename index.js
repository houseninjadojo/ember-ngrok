'use strict';

module.exports = {
  name: require('./package').name,

  includedCommands() {
    return {
      ngrok: require('./lib/commands/ngrok'),
    };
  },
};
