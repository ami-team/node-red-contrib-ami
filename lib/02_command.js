module.exports = function(RED)
{
	/*----------------------------------------------------------------------------------------------------------------*/

	const utility = require('./utility.js');

	/*----------------------------------------------------------------------------------------------------------------*/

	function AMICommand(config)
	{
		/*------------------------------------------------------------------------------------------------------------*/

		RED.nodes.createNode(this, config);

		/*------------------------------------------------------------------------------------------------------------*/

		this.on('input', (msg) => {

			if(global.amiSupervisor && global.amiConfig)
			{
				const commandMsg = utility.buildCommandMessage(
					global.amiConfig.topic,
					config.server || msg.server || '',
					config.command || msg.command || ''
				);

				msg.token = commandMsg.token;
				msg.topic = commandMsg.topic;
				msg.payload = commandMsg.payload;

				global.amiSupervisor.sendCommand(this, msg);
			}
		});

		/*------------------------------------------------------------------------------------------------------------*/
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	RED.nodes.registerType('command', AMICommand);

	/*----------------------------------------------------------------------------------------------------------------*/
}
