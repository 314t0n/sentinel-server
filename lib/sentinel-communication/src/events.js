var EVENTS = {
	DB: {
		USERS:{
			FIND: 'db:users:find',
			ADD: 'db:users:add'
		},
		CAMERA:{
			FIND: 'db:camera:find',
			FINDALL: 'db:camera:findall',
			ADD: 'db:camera:add',
			REMOVE: 'db:camera:remove',
			UPDATE: 'db:camera:update',
		}
	}
}

exports.EVENTS = EVENTS;