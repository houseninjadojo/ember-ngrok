/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
'use strict';

const chalk = require('chalk');
const ngrok = require('ngrok');
const ServeCommand = require('ember-cli/lib/commands/serve');

module.exports = ServeCommand.extend({
  name: 'ngrok',
  description: 'Runs ngrok to expose the application on a public URL',
  aliases: ['ng'],
  works: 'insideProject',

  onInterrupt() {
    this.ui.writeLine('\n');
    this.ui.writeLine('Stopping ngrok...');
    this.ngrokProcess?.kill();
  },

  async run(commandOptions) {
    // start ngrok
    this.ngrokProcess = await ngrok.connect(commandOptions.port);
    this.ui.writeLine(
      'ngrok is running on ' + chalk.blueBright.bold(this.ngrokProcess)
    );

    const ngrokHost = new URL(this.ngrokProcess).host;

    // set us up for livereload
    commandOptions.liveReloadJsUrl = `https://${ngrokHost}/_lr/livereload.js`;
    commandOptions.liveReloadOptions = {
      host: ngrokHost,
      port: 443,
      https: true,
    };

    // forward on to `ember serve`
    return this.runTask('Serve', commandOptions);
  },
});
