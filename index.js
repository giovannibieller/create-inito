#!/usr/bin/env node
const shell = require('shelljs');
const colors = require('colors');
const fs = require('fs');
const ora = require('ora');

const appName = process.argv[2];

const initoRepository = 'https://github.com/giovannibieller/inito.git';

const spinner = ora();

const run = async () => {
	spinner.start('Running initializer\n\n');
	if (appName) {
		// clone inito repository in app
		await gitCloneInito();
		// npm install
		await npmInstall();
		// change package.json name
		await changePackageName();
		// reinit with ne git
		await initGit();
		// first build
		await firstBuild();

		spinner.succeed(`Project ${appName.bold.white} successfully initialized\n`);
	} else {
		spinner.fail(
			`You have to specify a ${'PROJECT NAME'.bold.white}. ${
				'create-inito <PROJECT_NAME>'.white
			}`
		);
	}
};

const gitCloneInito = () => {
	spinner.start('Cloning repo\n');
	return new Promise(resolve => {
		shell.exec(`git clone ${initoRepository} ${appName}`, () => {
			spinner.succeed(`${'INITO'.bold.white} cloned as ${appName.bold.white}!\n`);
			resolve(true);
		});
	});
};

const npmInstall = () => {
	spinner.start(`Installing ${'NPM'.bold.white} packages\n`);
	return new Promise(resolve => {
		shell.exec(`cd ${appName} && npm install`, () => {
			spinner.succeed(`${'NPM'.bold} packages installed!\n`);
			resolve(true);
		});
	});
};

const changePackageName = () => {
	spinner.start(`Changing ${'package.json'.bold.white} name...\n`);
	return new Promise(resolve => {
		const package = JSON.parse(fs.readFileSync(`${appName}/package.json`));
		const packageLock = JSON.parse(fs.readFileSync(`${appName}/package-lock.json`));

		package.name = appName;
		packageLock.name = appName;

		fs.writeFileSync(`${appName}/package.json`, JSON.stringify(package), { spaces: 2 });
		fs.writeFileSync(`${appName}/package-lock.json`, JSON.stringify(packageLock), {
			spaces: 2
		});

		spinner.succeed(`${'package.json'.bold} name changed!\n`);

		resolve(true);
	});
};

const initGit = () => {
	spinner.start(`Inititalizing new ${'GIT'.bold.white}\n`);
	return new Promise(resolve => {
		shell.exec(`cd ${appName} && npm run git:remove && npm run git:init`, () => {
			spinner.succeed(`New ${'GIT'.bold} initialized!\n`);
			resolve(true);
		});
	});
};

const firstBuild = () => {
	spinner.start(`Building app ${appName.bold.white}\n`);
	return new Promise(resolve => {
		shell.exec(`cd ${appName} && npm run build`, () => {
			spinner.succeed(`${appName.bold.white} built successfully\n`);
			resolve(true);
		});
	});
};

run();
