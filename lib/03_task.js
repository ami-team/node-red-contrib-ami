module.exports = function(RED)
{
	/*----------------------------------------------------------------------------------------------------------------*/

	const utility = require('./utility.js');

	/*----------------------------------------------------------------------------------------------------------------*/

	function AMITask(config)
	{
		RED.nodes.createNode(this, config);

		this.on('input', (msg) => {

			if(global.amiSupervisor && global.amiConfig)
			{
				const commandMsg = utility.buildCommandMessage(
					global.amiConfig.topic,
					config.server || msg.server || '',
					'AddOneShotTask -name=? -command=? -description=? -commaSeparatedLocks="" -priority=? -timeStep=? -serverName=?',
					{params: [
						config.name || msg.name || '',
						config.command || msg.command || '',
						config.description || msg.description || '',
						config.priority || msg.priority || '0',
						config.time_step || msg.time_step || '0',
						config.server || msg.server || '',
					]}
				);

				msg.name = config.name;
				msg.topic = commandMsg.topic;
				msg.payload = commandMsg.payload;

				global.amiSupervisor.sendTask(this, msg);
			}
		});
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	RED.nodes.registerType('task', AMITask);

	/*----------------------------------------------------------------------------------------------------------------*/
}
