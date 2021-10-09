"use strict";

exports.handler = async (event, context) => {
	let responseBody = {
        message: 'Hello World',
        input: event
    };

    let response = {
        statusCode: 200,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(responseBody)
    };
	console.log('Response', JSON.stringify(response))
	return response
}
