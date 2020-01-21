export const USE_PROXY = true;


// export const URL_BASE = USE_PROXY ? 'api' : 'http://192.168.0.201:8080/api';     // SERVER NOSTRO
export const URL_BASE = USE_PROXY ? 'api' : 'http://localhost:8080/api';

export const URL = {
    LOGIN: URL_BASE + '/auth',
    GET_PROFILO: URL_BASE + '/auth/profiles',
    PUT_PROFILO_STUDENT: URL_BASE + '/auth/profiles/student',
    PUT_PROFILO_TEACHER: URL_BASE + '/auth/profiles/teacher',
    REGISTRATION_STUDENT: URL_BASE + '/registration/student',
    REGISTRATION_TEACHER: URL_BASE + '/registration/teacher',
    TEST: URL_BASE + '/test/aut',
    CHATMESSAGE: URL_BASE + '/chatmessage',
    CHAT_POST: URL_BASE + '/chats/post',
    MESSAGE: URL_BASE + '/chats/1/messaggi',


    CHATLIST: URL_BASE + '/chats',
    CHAT_CREATE: URL_BASE + '/chats/create',
    CHAT_COUNT: URL_BASE + '/chats/create/count',

    MESSAGE_OF_CHAT_PT_1: URL_BASE + '/chat/',
    MESSAGE_OF_CHAT_PT_2: '/message',
    MESSAGE_COUNT: '/count',
    LAST_MESSAGES: '/countmessage',

    SUBJECT: URL_BASE + '/subject',

    LESSON: URL_BASE + '/lessons',
    LESSON_MODIFY: URL_BASE + '/lessons/modify',

    PLANNING_CREATE: URL_BASE + '/lessons/plannings/create',
    PLANNING_MODIFY: URL_BASE + '/lessons/plannings/modify',
    PLANNING_ADD: URL_BASE + '/lessons/plannings/add',
    PLANNING_RESEARCH: URL_BASE + '/lessons/plannings/research',
    PLANNING_DELETE: URL_BASE + '/lessons/plannings/delete',
    PLANNING: URL_BASE + '/lessons/plannings',

    BOOKING: URL_BASE + '/lessons/bookings',
    BOOKING_MODIFY_LESSON_STATE: URL_BASE + '/lessons/bookings',

    BOOKING_RESEARCH: URL_BASE + '/bookings-lessons/research',
    BOOKING_HOME: URL_BASE + '/bookings-lessons/home',
    BOOKING_HISTORY: URL_BASE + '/bookings-lessons/history',
    BOOKING_HISTORY_FILTER: URL_BASE + '/bookings-lessons/history/filter',
    BOOKING_COUNT: URL_BASE + '/bookings-lessons/count'
};

export const X_AUTH = 'X-Auth';
export const AUTH = 'authorization';

export const AUTH_TOKEN = 'auth-token';
export const LINGUA = 'lingua';

export const UTENTE_STORAGE = 'utente';
export const MARIO = 'pluto';

export const STORAGE = {
    BOOKING: 'booking',
    HISTORY: 'storico',
    MESSAGE: 'message',
    CHATLIST: 'chat',
    CREATES: 'creates',
    PLANNING: 'planning',
    LESSON: 'lesson'

};
