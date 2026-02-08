const emailService = {
    /**
     * Send email to "to" email with subject and content
     * @param to
     * @param subject
     * @param content
     * @returns {boolean} true, if success
     */
    sendEmail: (to, subject, content) => {
        console.log({
            to, subject, content
        })
        return true;
    }
};

module.exports = emailService;