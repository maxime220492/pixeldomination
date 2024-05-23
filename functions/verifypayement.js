const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { paymentId } = JSON.parse(event.body);

    // Assuming you have a function to verify the payment
    const verificationResult = await verifyPayment(paymentId);

    return {
        statusCode: verificationResult.success ? 200 : 400,
        body: JSON.stringify(verificationResult),
    };
};
