let clans = [
    { id: '1', name: "Clan A", description: "The first clan", status: "open", members: [{ name: "Alice", level: 10 }, { name: "Bob", level: 5 }] },
    { id: '2', name: "Clan B", description: "The second clan", status: "closed", members: [{ name: "Charlie", level: 8 }, { name: "Dave", level: 3 }] },
];

exports.handler = async (event, context) => {
    const { clanId, member } = JSON.parse(event.body);
    const clan = clans.find(c => c.id === clanId);

    if (clan && clan.status === 'open') {
        clan.members.push(member);
        return {
            statusCode: 200,
            body: JSON.stringify(clan),
        };
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Clan not found or closed' }),
        };
    }
};
