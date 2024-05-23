exports.handler = async (event) => {
    const { id } = JSON.parse(event.body);

    // Assuming you have a function to get user data from a database
    const userData = await getUserDataFromDatabase(id);

    return {
        statusCode: 200,
        body: JSON.stringify(userData),
    };
};
