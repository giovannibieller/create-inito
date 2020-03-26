#!/usr/bin/env node
const shell = require('shelljs');
const colors = require('colors');
const fs = require('fs');
const ora = require('ora');

const initoRepository = 'https://github.com/giovannibieller/inito.git';

const sanitizeAppName = name => name.replace(/\s/g, '-').toLowerCase();
const appName = process.argv[2] || null;
const appNameSanitized = appName ? sanitizeAppName(appName) : null;

const spinner = ora();

const gitCloneInito = () => {
	spinner.start('Cloning repo\n');
	return new Promise(resolve => {
		shell.exec(`git clone ${initoRepository} ${appNameSanitized}`, () => {
			spinner.succeed(`${'INITO'.bold.white} cloned as ${appName.bold.white}!\n`);
			resolve(true);
		});
	});
};

const npmInstall = () => {
	spinner.start(`Installing ${'NPM'.bold.white} packages\n`);
	return new Promise(resolve => {
		shell.exec(`cd ${appNameSanitized} && npm install`, () => {
			spinner.succeed(`${'NPM'.bold.white} packages installed!\n`);
			resolve(true);
		});
	});
};

const changePackageName = () => {
	spinner.start(`Changing ${'package.json'.bold.white} name\n`);
	return new Promise(resolve => {
		const package = JSON.parse(fs.readFileSync(`${appNameSanitized}/package.json`));
		const packageLock = JSON.parse(fs.readFileSync(`${appNameSanitized}/package-lock.json`));

		package.name = appNameSanitized;
		packageLock.name = appNameSanitized;

		fs.writeFileSync(`${appNameSanitized}/package.json`, JSON.stringify(package), {
			spaces: 2
		});
		fs.writeFileSync(`${appNameSanitized}/package-lock.json`, JSON.stringify(packageLock), {
			spaces: 2
		});

		spinner.succeed(`${'package.json'.bold.white} name changed!\n`);

		resolve(true);
	});
};

const changeHtmlTitle = () => {
	spinner.start(`Changing ${'index.html'.bold.white} title\n`);
	return new Promise(resolve => {
		const html = fs.readFileSync(`${appNameSanitized}/public/index.html`);
		if (html) {
			const strHtml = html
				.toString()
				.replace(/<title>(.*)<\/title>/g, '<title>' + appName + '</title>');

			fs.writeFileSync(`${appNameSanitized}/public/index.html`, strHtml, 'utf8');

			spinner.succeed(`${'index.html'.bold.white} name changed!\n`);

			resolve(true);
		}
	});
};

const initGit = () => {
	spinner.start(`Inititalizing new ${'GIT'.bold.white}\n`);
	return new Promise(resolve => {
		shell.exec(`cd ${appNameSanitized} && rm -rf .git && git init`, () => {
			spinner.succeed(`New ${'GIT'.bold.white} initialized!\n`);
			resolve(true);
		});
	});
};

const firstBuild = () => {
	spinner.start(`Building app ${appName.bold.white}\n`);
	return new Promise(resolve => {
		shell.exec(`cd ${appNameSanitized} && npm run build`, () => {
			spinner.succeed(`${appName.bold.white} built successfully\n`);
			resolve(true);
		});
	});
};

const CreateInito = async () => {
	spinner.start('Running initializer\n\n');
	if (appName) {
		// clone inito repository in app
		await gitCloneInito();
		// change package.json name
		await changePackageName();
		// change html title
		await changeHtmlTitle();
		// reinit with ne git
		await initGit();
		// npm install
		await npmInstall();
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

module.exports = CreateInito;
