exports.handler = async function(event, context) {
    const { clanId, name } = JSON.parse(event.body);
    try {
        const clans = [/* your existing clans */];
        const clan = clans.find(c => c.id === clanId);
        if (!clan) throw new Error('Clan not found.');

        clan.members = clan.members.filter(member => member.name !== name);
        return {
            statusCode: 200,
            body: JSON.stringify(clan),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message }),
        };
    }
};
