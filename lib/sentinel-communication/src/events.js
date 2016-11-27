var EVENTS = {
    DB: {
        USERS: {
            FIND: 'db:users:find',
            FINDBYEMAIL: 'db:users:findbyemail',
            FINDALL: 'db:users:findall',
            ADD: 'db:users:add',
            REMOVE: 'db:users:remove',
            UPDATE: 'db:users:update',
        },
        CAMERA: {
            FIND: 'db:camera:find',
            FINDALL: 'db:camera:findall',
            ADD: 'db:camera:add',
            REMOVE: 'db:camera:remove',
            UPDATE: 'db:camera:update',
        },
        CONFIG: {
            FIND: 'db:config:find',
            FINDALL: 'db:config:findall',
            ADD: 'db:config:add',
            REMOVE: 'db:config:remove',
            UPDATE: 'db:config:update',
        },
    }
}

exports.EVENTS = EVENTS;