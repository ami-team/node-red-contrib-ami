global.amiSupervisor = null;

module.exports = function(RED)
{
	function AMISupervisor(config)
	{
		RED.nodes.createNode(this, config);

		global.amiSupervisor = this;

		this.on('input', (msg) => {
			console.log(msg);
		});
	}

	RED.nodes.registerType('supervisor', AMISupervisor);
}