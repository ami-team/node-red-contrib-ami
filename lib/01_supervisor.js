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

global.amiSupervisor = null;
global.amiConfig = null;

module.exports = function(RED)
{
	'use strict';

	const utility = require('./utility.js');

	/*----------------------------------------------------------------------------------------------------------------*/

	function AMISupervisor(config)
	{
		/*------------------------------------------------------------------------------------------------------------*/

		RED.nodes.createNode(this, config);

		/*------------------------------------------------------------------------------------------------------------*/

		global.amiSupervisor = this;
		global.amiConfig = config;

		this.L = {}; // COMMANDS
		this.M = {}; // TASKS

		/*------------------------------------------------------------------------------------------------------------*/

		this.sendCommand = (commandNode, msg) => {

			this.L[msg.token] = commandNode;
			////.M[`${msg.token}-${global.amiConfig.topic}`] = commandNode;

			this.send(msg);
		}

		/*------------------------------------------------------------------------------------------------------------*/

		this.sendTask = (commandNode, msg) => {

			this.L[msg.token] = commandNode;
			this.M[`${msg.token}-${global.amiConfig.topic}`] = commandNode;

			this.send(msg);
		}

		/*------------------------------------------------------------------------------------------------------------*/

		this.on('input', (msg) => {

			/**/ if(msg.topic === config.topic)
			{
				/*----------------------------------------------------------------------------------------------------*/

				const result = utility.readMQTTCommandResult(this.L, msg.payload);

				if(result)
				{
					msg.json = result.json;
					msg.payload = result.data;

					/**/ if(result.node.$name === 'ami-mqtt-command')
					{
						result.node.send(msg);
					}
					else if(result.node.$name === /**/'ami-task'/**/)
					{
						result.node.send([
							msg,
							null,
							null,
							null,
						]);
					}
				}

				/*----------------------------------------------------------------------------------------------------*/
			}
			else if(msg.topic === 'ami/taskserver/task')
			{
				/*----------------------------------------------------------------------------------------------------*/

				const result = utility.readTaskResult(this.M, msg.payload);

				if(result)
				{
					msg.json = result.json;
					msg.payload = result.data;

					/**/ if(result.data.state === "RUNNING")
					{
						result.node.send([null, msg, null, null]);
					}
					else if(result.data.state === "FINISHED")
					{
						if(result.data.success)
						{
							result.node.send([null, null, msg, null]);
						}
						else
						{
							result.node.send([null, null, null, msg]);
						}
					}
				}

				/*----------------------------------------------------------------------------------------------------*/
			}
		});

		/*------------------------------------------------------------------------------------------------------------*/
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	RED.nodes.registerType('supervisor', AMISupervisor, {
		credentials: {
			username: {type: 'text'},
			password: {type: 'password'},
		}
	});

	/*----------------------------------------------------------------------------------------------------------------*/
}
