const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const os = require('os');
const path = require('path');


function is_yes(value) {
  return ['yes', 'true'].includes(value.toLowerCase());
}


async function run() {
  try {
    const version = core.getInput('version');
    const preview = is_yes(core.getInput('preview'));
    const createVirtualenvs = is_yes(core.getInput('create_virtualenvs'));

    core.info('Retrieving Poetry Installation Script...');
    await exec ('curl -O -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py');

    core.info('Installing Poetry...');
    const flags = preview ? '--preview' : version ? `--version=${version}` : '';
    await exec.exec(`python get-poetry.py --yes ${flags}`);

    core.info('Configuring environment...');
    core.addPath(path.join(os.homedir(), '.poetry', 'bin'));
    core.info(`PATH SET TO: ${process.env['PATH']}`);
    if (!createVirtualenvs) {
      await exec.exec('poetry config virtualenvs.create false');
    }

    core.info('Cleaning up...');
    fs.unlinkSync('get-poetry.py');
  } catch (error) {
    core.setFailed(error.message);
  }
}


run();

