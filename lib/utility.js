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

/*--------------------------------------------------------------------------------------------------------------------*/

const crypto = require('crypto');

/*--------------------------------------------------------------------------------------------------------------------*/

let _cnt = 0;

const _paramRegExp = new RegExp('-\\W*([a-zA-Z][a-zA-Z0-9]*)\\W*=\\W*\\?', 'g');

const _responseRegExp = new RegExp('AMI-RESPONSE<([0-9]+),(true|false)>(.*)', 's');

/*--------------------------------------------------------------------------------------------------------------------*/

function getToken()
{
	return _cnt++;
}

/*--------------------------------------------------------------------------------------------------------------------*/

function getTaskName()
{
	return `task-${crypto.randomUUID().substr(0, 8)}`;
}

/*--------------------------------------------------------------------------------------------------------------------*/

function buildMQTTCommandMessage(token, uuid, serverName, command, options)
{
	options = options || {};

	/*----------------------------------------------------------------------------------------------------------------*/

	const params = options.params || [];

	/*----------------------------------------------------------------------------------------------------------------*/

	const converter = ('converter' in options) ? (options.converter || '') : 'AMIXmlToJson.xsl';

	/*----------------------------------------------------------------------------------------------------------------*/

	command = (command || '').trim().replace(_paramRegExp, (x, y) => {

		const rawValue = params.shift();

		return Object.prototype.toString.call(rawValue) === '[object String]' ? `-${y}=${JSON.stringify(rawValue)}`
		                                                                      : `-${y}="${JSON.stringify(rawValue)}"`
		;
	});

	/*----------------------------------------------------------------------------------------------------------------*/

	const topic = `ami/${serverName}/command/${converter}`;

	const message = `AMI-COMMAND<${token},"${uuid}","node-red">${command}`;

	/*----------------------------------------------------------------------------------------------------------------*/

	return {
		topic: topic,
		payload: message,
	};

	/*----------------------------------------------------------------------------------------------------------------*/
}

/*--------------------------------------------------------------------------------------------------------------------*/

function readMQTTCommandResult(L, payload)
{
	try
	{
		const m = payload.match(_responseRegExp);

		if(m)
		{
			/*--------------------------------------------------------------------------------------------------------*/

			const token = parseInt(m[1]);

			const data = m[2] ? JSON.parse(m[3])
			                  : /*------*/(m[3])
			;

			/*--------------------------------------------------------------------------------------------------------*/

			if(token in L)
			{
				const node = L[token];

				delete L[token];

				return {
					node: node,
					data: data,
				};
			}

			/*--------------------------------------------------------------------------------------------------------*/
		}
	}
	catch(e)
	{
		return null;
	}

	return null;
}

/*--------------------------------------------------------------------------------------------------------------------*/

function readTaskResult(M, payload)
{
	try
	{
		/*------------------------------------------------------------------------------------------------------------*/

		const data = JSON.parse(payload);

		const taskName = data.task_name;

		/*------------------------------------------------------------------------------------------------------------*/

		if(taskName in M)
		{
			const node = M[taskName];

			if(data.state === "FINISHED")
			{
				delete M[taskName];
			}

			return {
				node: node,
				data: data,
			};
		}

		/*------------------------------------------------------------------------------------------------------------*/
	}
	catch(e)
	{
		return null;
	}

	return null;
}

/*--------------------------------------------------------------------------------------------------------------------*/

module.exports = {
	getToken: getToken,
	getTaskName: getTaskName,
	buildMQTTCommandMessage: buildMQTTCommandMessage,
	readMQTTCommandResult: readMQTTCommandResult,
	readTaskResult: readTaskResult,
};

/*--------------------------------------------------------------------------------------------------------------------*/
