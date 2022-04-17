/*!
 * NODE-RED-CONTRIB-AMI
 *
 * Copyright (c) 2021-2022 The AMI Team, CNRS/LPSC
 *
 * This file must be used under the terms of the CeCILL-C:
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-fr.html
 *
 */

const utility = require('./utility.js');

module.exports = function(RED)
{
	/*----------------------------------------------------------------------------------------------------------------*/

	function AMIHTTPCommand(config)
	{
		/*------------------------------------------------------------------------------------------------------------*/

		RED.nodes.createNode(this, config);

		this.$name = 'ami-http-command';

		/*------------------------------------------------------------------------------------------------------------*/

		this.on('input', (msg) => {


		});

		/*------------------------------------------------------------------------------------------------------------*/
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	RED.nodes.registerType('http-command', AMIHTTPCommand);

	/*----------------------------------------------------------------------------------------------------------------*/
}
