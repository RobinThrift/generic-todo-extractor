module.exports = function register(config) {
    return (tag, params, lines) => {
        switch (config.transform.toLowerCase()) {
            case 'uppercase':
                tag.tagName = tag.tagName.toUpperCase();
                break;
            case 'lowercase':
                tag.tagName = tag.tagName.toLowerCase();
                break;
        }
        return tag;
    };
}
