async function searchEmailId(auth) {
	const gmail = google.gmail({ version: 'v1', auth });

	const query = 'notice@pnclassaction.com';

	const res = await gmail.users.messages.list({
		userId: 'me',
		q: query,
		maxResults: 5,
	});
	const msgId = res.data.messages[0].id;

	console.log(msgId);

	return msgId;
}

async function getEmailContent(id, auth) {
	const gmail = google.gmail({ version: 'v1', auth });

	const msg = await gmail.users.messages.get({
		userId: 'me',
		id: id,
	});

	return msg.data;
}
