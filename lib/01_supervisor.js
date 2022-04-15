global.amiSupervisor = null;

module.exports = function(RED)
{
	const utility = require('./utility.js');

	function AMISupervisor(config)
	{
		RED.nodes.createNode(this, config);

		global.amiSupervisor = this;
		global.amiConfig = config;

		this.L = {};

		this.sendCommand = (commandNode, msg) => {

			this.L[msg.token] = commandNode;

			this.send(msg);
		}

		this.on('input', (msg) => {

			if(msg.topic === config.topic)
            {
				const result = utility.readCommandResult(this.L, msg.payload);

				if(result)
				{
					msg.json = result.json;
					msg.payload = result.data;

					result.node.send(msg);
				}
			}
		});
	}

	RED.nodes.registerType('supervisor', AMISupervisor);
}