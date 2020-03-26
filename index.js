#!/usr/bin/env node
const shell = require('shelljs');
const colors = require('colors');
const fs = require('fs');
const readline = require('readline');

const appName = process.argv[2];
const appDirectory = `${process.cwd()}/${appName}`;

const initoRepository = 'https://github.com/giovannibieller/inito.git';

const run = async () => {
	// clone inito repository in app
	await gitCloneInito();
	// npm install
	await npmInstall();
	// change package.json name
	await changePackageName();
	// reinit with ne git
	await initGit();
};

// const createDirectory = () => {
// 	return new Promise(resolve => {
// 		shell.exec(`mkdir ${appName}`, () => {
// 			console.log(`Directory ${appName.bold} created!`);
// 			resolve(true);
// 		});
// 	});
// };

const gitCloneInito = () => {
	return new Promise(resolve => {
		shell.exec(`git clone ${initoRepository} ${appName}`, () => {
			console.log(`${'INITO'.bold} cloned as ${appName.bold}!`);
			resolve(true);
		});
	});
};

const npmInstall = () => {
	console.log(`Installing ${'NPM'.bold} packages...`);
	return new Promise(resolve => {
		shell.exec(`cd ${appName} && npm install`, () => {
			console.log(`${'NPM'.bold} packages installed!`);
			resolve(true);
		});
	});
};

const changePackageName = () => {
	console.log(`Changing ${'package.json'.bold} name...`);
	return new Promise(resolve => {
		const package = JSON.parse(fs.readFileSync(`${appName}/package.json`));
		const packageLock = JSON.parse(fs.readFileSync(`${appName}/package-lock.json`));

		package.name = appName;
		packageLock.name = appName;

		fs.writeFileSync(`${appName}/package.json`, JSON.stringify(package), { spaces: 2 });
		fs.writeFileSync(`${appName}/package-lock.json`, JSON.stringify(packageLock), {
			spaces: 2
		});

		console.log(`${'package.json'.bold} name changed!`);

		resolve(true);
	});
};

const initGit = () => {
	console.log(`Inititalizing new ${'GIT'.bold}...`);
	return new Promise(resolve => {
		shell.exec(`cd ${appName} && npm run git:remove && npm run git:init`, () => {
			console.log(`New ${'GIT'.bold} initialized!`);
			resolve(true);
		});
	});
};

run();
