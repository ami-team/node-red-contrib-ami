module.exports = function(RED)
{
	/*----------------------------------------------------------------------------------------------------------------*/

	const utility = require('./utility.js');

	/*----------------------------------------------------------------------------------------------------------------*/

	function AMICommand(config)
	{
		/*------------------------------------------------------------------------------------------------------------*/

		RED.nodes.createNode(this, config);

		this.$name = 'ami-command';

		/*------------------------------------------------------------------------------------------------------------*/

		this.on('input', (msg) => {

			if(global.amiSupervisor && global.amiConfig)
			{
				const token = utility.getToken();

				const commandMsg = utility.buildCommandMessage(
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

	RED.nodes.registerType('command', AMICommand);

	/*----------------------------------------------------------------------------------------------------------------*/
}
