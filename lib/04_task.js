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
const utility = require('./utility.js');
module.exports = function(RED)
{
	'use strict';

	const vm = require('vm');

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

				const token = utility.getToken();

				const taskName = utility.getTaskName();

				const commandMsg = utility.buildMQTTCommandMessage(
					token,
					global.amiConfig.topic,
					config.server || msg.server || global.amiConfig.server || '',
					'AddTask -name=? -command=? -description=? -commaSeparatedLocks="" -locked="0" -oneShot="1" -priority=? -timeStep=? -serverName=?',
					{params: [
						taskName,
						context.command.split(/\s*\n\s*/).filter(x => x).join(' && '),
						config.description || msg.description || '',
						config.priority || msg.priority || '0',
						config.time_step || msg.time_step || '0',
						config.server || msg.server || global.amiConfig.server || '',
					]}
				);

				msg.token = token;
				msg.taskName = taskName;
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
