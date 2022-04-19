/*!
 * NODE-RED-CONTRIB-AMI
 *
 * Copyright (c) 2021-2022 The AMI Team, CNRS/LPSC
 *
 * This file must be used under the terms of the CeCILL-C:
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-fr.html
 *
 */

const crypto = require('crypto');
module.exports = function(RED)
{
	'use strict';

	const vm = require('vm');

	const crypto = require("crypto");

	const utility = require('./utility.js');

	/*----------------------------------------------------------------------------------------------------------------*/

	function AMITask(config)
	{
		/*------------------------------------------------------------------------------------------------------------*/

		RED.nodes.createNode(this, config);

		this.$name = 'ami-task';

		/*------------------------------------------------------------------------------------------------------------*/

		this.on('input', (msg) => {

			if(global.amiSupervisor && global.amiConfig)
			{
				/*----------------------------------------------------------------------------------------------------*/

				const context = {command: null, msg: msg};

				vm.createContext(context);

				/*----------------------------------------------------------------------------------------------------*/

				try
				{
					const js = `command = (() => \`${config.script || ''}\`)();`;

					console.log(js);

					const script = new vm.Script(js);

					script.runInContext(context);
				}
				catch(e)
				{
					/* IGNORE */
				}

				/*----------------------------------------------------------------------------------------------------*/

				const task = crypto.randomUUID();

				const token = utility.getToken();

				const commandMsg = utility.buildMQTTCommandMessage(
					token,
					global.amiConfig.topic,
					config.server || msg.server || global.amiConfig.server || '',
					'AddOneShotTask -name=? -command=? -description=? -commaSeparatedLocks="" -priority=? -timeStep=? -serverName=?',
					{params: [
						task,
						context.command.split(/\s*\n\s*/).filter(x => x).join(' && '),
						config.description || msg.description || '',
						config.priority || msg.priority || '0',
						config.time_step || msg.time_step || '0',
						config.server || msg.server || global.amiConfig.server || '',
					]}
				);

				msg.task = task;
				msg.token = token;
				msg.topic = commandMsg.topic;
				msg.payload = commandMsg.payload;

				global.amiSupervisor.sendTask(this, msg);
			}
		});

		/*------------------------------------------------------------------------------------------------------------*/
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	RED.nodes.registerType('task', AMITask);

	/*----------------------------------------------------------------------------------------------------------------*/
}
