export const USE_PROXY = true;


export const URL_BASE = USE_PROXY ? 'api' : 'http://localhost:8080/api';
export const URL_BASE2 = USE_PROXY ? 'todos' : 'http://jsonplaceholder.typicode.com/todos';

export const URL = {
    LOGIN: URL_BASE + '/authentication-1',
    TEST: URL_BASE + '/test/aut',
    CHATMESSAGE: URL_BASE + '/chatmessage',
    TESTTODOS: URL_BASE2 + '/1'
};

export const X_AUTH = 'X-Auth';

export const AUTH_TOKEN = 'auth-token';

export const LINGUA = 'lingua';
