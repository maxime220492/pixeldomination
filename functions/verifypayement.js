exports.handler = async (event, context) => {
    // Parse the event body to get transaction details
    const { transactionHash } = JSON.parse(event.body);
    try {
        // Verify the transaction on Radix DLT (this is a placeholder, actual implementation needed)
        const response = await fetch(`https://api.radixdlt.com/transactions/${transactionHash}`);
        const transactionData = await response.json();

        if (transactionData && transactionData.status === 'CONFIRMED') {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Payment verified' }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Payment verification failed' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Internal Server Error: ${error.message}` }),
        };
    }
};