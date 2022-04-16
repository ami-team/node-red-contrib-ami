global.amiSupervisor = null;

module.exports = function(RED)
{
	/*----------------------------------------------------------------------------------------------------------------*/

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
				const result = utility.readCommandResult(this.L, msg.payload);

				if(result)
				{
					msg.json = result.json;
					msg.payload = result.data;

					/**/ if(result.node.$name === 'ami-command')
					{
						result.node.send(msg);
					}
					else if(result.node.$name === 'ami-task')
					{
						result.node.send([
							null,
							null,
							msg,
						]);
					}
				}
			}
			else if(msg.topic === 'ami/taskserver/task')
			{
				const result = utility.readTaskResult(this.M, msg.payload);

				if(result)
				{
					msg.json = result.json;
					msg.payload = result.data;

					result.node.send(result.data.success ? [msg, null, null]
					                                     : [null, msg, null]
					);
				}
			}
		});

		/*------------------------------------------------------------------------------------------------------------*/
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	RED.nodes.registerType('supervisor', AMISupervisor);

	/*----------------------------------------------------------------------------------------------------------------*/
}
