exports.handler = async (event) => {
    const { name, description, status } = JSON.parse(event.body);

    const newClan = {
        id: Date.now().toString(),
        name,
        description,
        status,
        members: [],
    };

    // Assuming you have a function to save the clan to a database
    await saveClanToDatabase(newClan);

    return {
        statusCode: 200,
        body: JSON.stringify(newClan),
    };
};
