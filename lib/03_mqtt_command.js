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

module.exports = function(RED)
{
	'use strict';

	const utility = require('./utility.js');

	/*----------------------------------------------------------------------------------------------------------------*/

	function AMIMQTTCommand(config)
	{
		/*------------------------------------------------------------------------------------------------------------*/

		RED.nodes.createNode(this, config);

		this.$name = 'ami-mqtt-command';

		/*------------------------------------------------------------------------------------------------------------*/

		this.on('input', (msg) => {

			if(global.amiSupervisor && global.amiConfig)
			{
				const token = utility.getToken();

				const commandMsg = utility.buildMQTTCommandMessage(
					token,
					global.amiConfig.topic,
					config.server || msg.server || '',
					config.command || msg.command || ''
				);

				msg.token = token;
				msg.topic = commandMsg.topic;
				msg.payload = commandMsg.payload;

				global.amiSupervisor.sendCommand(this, msg);
			}
		});

		/*------------------------------------------------------------------------------------------------------------*/
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	RED.nodes.registerType('mqtt command', AMIMQTTCommand);

	/*----------------------------------------------------------------------------------------------------------------*/
}
