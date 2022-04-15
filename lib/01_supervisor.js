module.exports = function(RED)
{
	function AMISupervisor(config)
	{
		RED.nodes.createNode(this, config);

		this.on('input', (msg) => {
		});
	}

	RED.nodes.registerType('supervisor', AMISupervisor);
}