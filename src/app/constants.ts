export const USE_PROXY = true;


export const URL_BASE = USE_PROXY ? 'api' : 'http://192.168.0.201:8080/api';     // SERVER NOSTRO
export const URL_BASE2 = USE_PROXY ? 'todos' : 'http://jsonplaceholder.typicode.com/todos';    // SERVER DI PROVA
export const URL_BASE3 = USE_PROXY ? 'posts' : 'https://jsonplaceholder.typicode.com';

export const URL = {
    LOGIN: URL_BASE + '/authentication-1',
    REGISTRATION_STUDENT: URL_BASE + '/registration/student',
    REGISTRATION_TEACHER: URL_BASE + '/registration/teacher',
    TEST: URL_BASE + '/test/aut',
    CHATMESSAGE: URL_BASE + '/chatmessage',
    TESTTODOS: URL_BASE2 + '/1',
    MESSAGE: URL_BASE + '/chats/1/messaggi',
    REGISTRAZIONE: URL_BASE3
};

export const X_AUTH = 'X-Auth';

export const AUTH_TOKEN = 'auth-token';
export const LINGUA = 'lingua';

export const UTENTE_STORAGE = 'utente';
export const MARIO = 'pluto';
