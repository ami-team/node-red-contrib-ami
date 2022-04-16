module.exports = function(RED)
{
	/*----------------------------------------------------------------------------------------------------------------*/

	const utility = require('./utility.js');

	/*----------------------------------------------------------------------------------------------------------------*/

	function AMITask(config)
	{
		/*------------------------------------------------------------------------------------------------------------*/

		RED.nodes.createNode(this, config);

		this.$name = 'ami-task-node';

		/*------------------------------------------------------------------------------------------------------------*/

		this.on('input', (msg) => {

			if(global.amiSupervisor && global.amiConfig)
			{
				const token = utility.getToken(global.amiConfig.topic);

				const commandMsg = utility.buildCommandMessage(
					token,
					global.amiConfig.topic,
					config.server || msg.server || '',
					'AddOneShotTask -name=? -command=? -description=? -commaSeparatedLocks="" -priority=? -timeStep=? -serverName=?',
					{params: [
						`${token}-${global.amiConfig.topic}`,
						config.command || msg.command || '',
						config.description || msg.description || '',
						config.priority || msg.priority || '0',
						config.time_step || msg.time_step || '0',
						config.server || msg.server || '',
					]}
				);

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
