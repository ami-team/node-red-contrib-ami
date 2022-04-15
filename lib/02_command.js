module.exports = function(RED)
{
	function AMICommand(config)
	{
		RED.nodes.createNode(this, config);

		this.on('input', (msg) => {
		});
	}

	RED.nodes.registerType('command', AMICommand);
}