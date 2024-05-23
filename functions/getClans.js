exports.handler = async () => {
    // Assuming you have a function to get all clans from a database
    const clans = await getAllClansFromDatabase();

    return {
        statusCode: 200,
        body: JSON.stringify(clans),
    };
};
