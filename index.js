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

    core.startGroup('Retrieving Poetry Installation Script');
    await exec.exec('curl -sSL -o install-poetry.py https://install.python-poetry.org');
    core.endGroup();

    core.startGroup('Installing Poetry');
    const flags = preview ? '--preview' : version ? `--version=${version}` : '';
    await exec.exec(`python install-poetry.py --yes ${flags}`);
    core.endGroup();

    core.startGroup('Configuring environment');
    if (process.env['RUNNER_OS'] === 'Windows') {
      core.addPath(path.join(os.homedir(), 'AppData', 'Roaming', 'Python', 'Scripts'));
    } else {
      core.addPath(path.join(os.homedir(), '.local', 'bin'));
    }
    core.info(`Path set to: ${process.env['PATH']}`);
    if (!createVirtualenvs) {
      await exec.exec('poetry config virtualenvs.create false');
    }
    core.endGroup();

    core.startGroup('Cleaning up...');
    fs.unlinkSync('install-poetry.py');
    core.endGroup();
  } catch (error) {
    core.setFailed(error.message);
  }
}


run();

