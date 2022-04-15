module.exports = function(RED)
{
	const utility = require('./utility.js');

	function AMICommand(config)
	{
		RED.nodes.createNode(this, config);

		this.on('input', (msg) => {

			const commandMsg = utility.buildCommandMessage('command-return', 'TASK_SERVER_FAB', 'GetServerStatus');

			msg.topic = commandMsg.topic;
			msg.payload = commandMsg.payload;

			this.send(msg);
		});
	}

	RED.nodes.registerType('command', AMICommand);
}