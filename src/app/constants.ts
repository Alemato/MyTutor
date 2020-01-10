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
    HOME_BOOKING: URL_BASE + 'bookings-lessons/home',
    PLANNING: URL_BASE + '/lessons/plannings',
};

export const X_AUTH = 'X-Auth';
export const AUTH = 'authorization';

export const AUTH_TOKEN = 'auth-token';
export const LINGUA = 'lingua';

export const UTENTE_STORAGE = 'utente';
export const MARIO = 'pluto';

export const STORAGE = {
    BOOKING : 'booking',
    HISTORY : 'storico',
};
