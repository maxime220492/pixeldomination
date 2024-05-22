let clans = [
    { id: '1', name: "Clan A", description: "The first clan", status: "open", members: [{ name: "Alice", level: 10 }, { name: "Bob", level: 5 }] },
    { id: '2', name: "Clan B", description: "The second clan", status: "closed", members: [{ name: "Charlie", level: 8 }, { name: "Dave", level: 3 }] },
];

exports.handler = async (event, context) => {
    const { clanId, name } = JSON.parse(event.body);
    const clan = clans.find(c => c.id === clanId);

    if (clan) {
        const memberIndex = clan.members.findIndex(member => member.name === name);
        if (memberIndex > -1) {
            clan.members.splice(memberIndex, 1);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Quit the clan' }),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Member not found' }),
            };
        }
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Clan not found' }),
        };
    }
};
