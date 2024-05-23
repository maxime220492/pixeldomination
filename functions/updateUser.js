exports.handler = async (event) => {
    const userData = JSON.parse(event.body);

    // Assuming you have a function to update user data in the database
    const updatedUser = await updateUserInDatabase(userData);

    return {
        statusCode: 200,
        body: JSON.stringify(updatedUser),
    };
};
