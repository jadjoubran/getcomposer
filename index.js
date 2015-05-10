(function(){
	"use strict";

	var exec = require('child_process').exec,
	chalk = require('chalk'),
	download_progress_id = null;

	run();

	function install_composer(){

		console.log(
			chalk.yellow('\nDownloading composer\n')
			);

		var command = exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php');

		download_progress_id = setInterval(function(){
			process.stdout.write('.');
		}, 100);

		command.stdout.on('data', function (installation_progress) {
			stop_download_progress();
			console.log(installation_progress);
		});

		command.on('exit', function (exitCode) {
			stop_download_progress();
			if ( exitCode === 0 ){
				console.log(
					chalk.green('Composer successfully installed')
					);
			}
		});

		command.on('error', function (error) {
			stop_download_progress();
			console.log("Error occurred: " + error);
		});
	}

	function run(){
		//check for php cli
		exec('php --version',  function (error, stdout, stderr) {
			if ( error ){
				console.log(
					chalk.red('PHP not found. Make sure that it\'s installed and that it is in your path.\n' +
						'If you just added to your path, make sure to restart your shell')
					);
				return false;
			}
			install_composer();
		});
	}

	function stop_download_progress(){
		if ( download_progress_id ){
			clearInterval( download_progress_id );
			console.log('');
			download_progress_id = null;
		}
	}



})();