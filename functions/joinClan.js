const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { clanCode } = JSON.parse(event.body);

    // Assuming you have a function to add a user to a clan in the database
    const updatedClan = await addUserToClan(clanCode);

    return {
        statusCode: 200,
        body: JSON.stringify(updatedClan),
    };
};
