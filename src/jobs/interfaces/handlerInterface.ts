interface Handler {
    /**
     * Handles the job processing.
     * This method should contain the logic to process the job.
     * It should return a promise that resolves when the job is done.
     * If the job fails, it should reject the promise with an error.
     * @returns {Promise<void>} A promise that resolves when the job is processed.
     * @throws {Error} If the job fails to process.
     */
    handle(): Promise<void>;
}

export default Handler;