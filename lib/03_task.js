module.exports = function(RED)
{
	function AMITask(config)
	{
		RED.nodes.createNode(this, config);

		this.on('input', (msg) => {
		});
	}

	RED.nodes.registerType('task', AMITask);
}