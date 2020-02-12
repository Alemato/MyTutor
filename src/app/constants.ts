export const USE_PROXY = true;


export const URL_BASE = USE_PROXY ? 'api' : 'http://192.168.0.203:8080/api';     // SERVER NOSTRO
// export const URL_BASE = USE_PROXY ? 'api' : 'http://localhost:8080/api';

export const URL = {
    LOGIN: URL_BASE + '/auth',
    GET_PROFILO: URL_BASE + '/auth/profiles',
    PUT_PROFILO_STUDENT: URL_BASE + '/auth/profiles/student',
    PUT_PROFILO_TEACHER: URL_BASE + '/auth/profiles/teacher',
    REGISTRATION_STUDENT: URL_BASE + '/registration/student',
    REGISTRATION_TEACHER: URL_BASE + '/registration/teacher',
    CHAT_POST: URL_BASE + '/chats/post',


    CHATLIST: URL_BASE + '/chats',
    CHAT_CREATE: URL_BASE + '/chats/create',
    CHAT_COUNT: URL_BASE + '/chats/count',
    CHAT_CREATES: URL_BASE + '/chats/creates/',

    MESSAGE_OF_CHAT_PT_1: URL_BASE + '/chats/',
    MESSAGE_OF_CHAT_PT_2: '/messages',
    MESSAGE_COUNT: '/count',
    LAST_MESSAGES: '/last',

    SUBJECT: URL_BASE + '/subject',

    LESSON: URL_BASE + '/lessons',
    LESSON_MODIFY: URL_BASE + '/lessons/modify',
    LESSON_ALL_FOR_STUDENT: URL_BASE + '/lessons/student',
    LESSON_CREATE: URL_BASE + '/lessons/create',
    LESSON_SINGLE: URL_BASE + '/lessons/',

    PLANNING_CREATE: URL_BASE + '/lessons/plannings/create',
    PLANNING_MODIFY: URL_BASE + '/lessons/plannings/modify',
    PLANNING_ADD: URL_BASE + '/lessons/plannings/add',
    PLANNING_RESEARCH: URL_BASE + '/lessons/plannings/research',
    PLANNING_DELETE: URL_BASE + '/lessons/plannings/delete',
    PLANNING: URL_BASE + '/lessons/plannings',

    BOOKING: URL_BASE + '/lessons/bookings',
    BOOKING_MODIFY_LESSON_STATE: URL_BASE + '/lessons/bookings',

    BOOKING_RESEARCH: URL_BASE + '/lessons/bookings/research',
    BOOKING_HOME: URL_BASE + '/lessons/bookings/home',
    BOOKING_HISTORY: URL_BASE + '/lessons/bookings/history',
    BOOKING_COUNT: URL_BASE + '/lessons/bookings/count'
};

export const X_AUTH = 'X-Auth';
export const AUTH = 'authorization';

export const AUTH_TOKEN = 'auth-token';
export const LINGUA = 'lingua';

export const UTENTE_STORAGE = 'utente';

export const STORAGE = {
    BOOKING: 'booking',
    HISTORY: 'storico',
    MESSAGE: 'message',
    CHATLIST: 'chat',
    CREATES: 'creates',
    PLANNING: 'planning',
    LESSON: 'lesson'
};
