const CHANNELS = {
    WEB: 'web',
    WHATSAPP: 'whatsapp',
    TELEGRAM: 'telegram'
};

const FLOW_TYPES = {
    CHAT: 'chat',
    VOICE: 'voice'
};

const LANGUAGES = {
    ES: 'es',
    EN: 'en'
};

const PRINT_NODE_FORMAT = {
    INLINE: 'inline',
    ASYNC: 'async'
};

module.exports = {
    CHANNELS,
    CHANNELS_LIST: Object.values(CHANNELS),
    
    FLOW_TYPES,
    FLOW_TYPES_LIST: Object.values(FLOW_TYPES),
    
    LANGUAGES,
    LANGUAGES_LIST: Object.values(LANGUAGES),

    PRINT_NODE_FORMAT,
    PRINT_NODE_FORMAT_LIST: Object.values(PRINT_NODE_FORMAT)
};