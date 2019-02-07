const cleanup = (author, message, countdown, text) => {
    const loop = (time) => {
        if (time <= 4) {
            const pluralize = time > 1 ? 's' : '';
            const mention = `${author}`.concat(text);
            const updatedText = mention.concat(`\nRemoving menu in ${time} second${pluralize}`);
            message.edit(updatedText);
        }
        if (time === 0) {
            return message.delete();
        }
        setTimeout(loop, 1000, --time);
    };
    setTimeout(loop, 1000, --countdown);
};

module.exports = {
    cleanup
};
