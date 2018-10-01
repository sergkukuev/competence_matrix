const   basic       = require('basic-auth'),
        strategy    = require('./strategy'),
        validator   = require('./../validators'),
        life        = require('./../../config').security.STLife,
        log         = require('./../../config/log')(module);

const   TError = require('./../validators/format').TError;
const   basicType  = /basic/i,
        bearerType = /bearer/i;

module.exports = {
    // Получение кода пользователя для авторизации
    GetUserCode : function (data, callback) {
        log.info('Get user code for auth');
        const validator = checkResType(data.response_type, 'code');
        if (!validator)
            return callback(new Error('Invalid response type'), 400, null);

        return strategy.CheckServiceById(data.appId, function (err, status, response) {
            if (err)
                return callback(err, status, response);
            else if (!response)
                return callback(err, status, null);
            return strategy.GetUserCode(data.login, data.password, function(err, status, code){
                return callback(err, status, code);
            });
        });
    },
    // Пересоздание токенов пользователя по коду
    SetUTokenByCode : function(code, callback) {
        log.info('Set user tokens by code');
        return strategy.UTokenByCode(code, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    },
    // Пересоздание токенов пользователя по паролю
    SetUTokenByPass : function(data, callback) {
        log.info('Set user tokens by password');
        return strategy.UTokenByPass(data, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    },
    // Пересоздание токенов пользователя по токену
    SetUTokenByToken : function(token, callback) {
        log.info('Set user tokens by token');
        return strategy.UTokenByToken(token, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    },
    ServiceAuth,
    UserAuth
}

// Проверка сервисной авторизации
function ServiceAuth(header_auth, callback) {
    log.info('Checker service authorization');
    if (!validator.Validity(header_auth))
        return callback(TError(null, true, 'Header "authorization" is undefined', 401), null);

    choiceSAuth(header_auth, function(err, status, scope) {
        if (err || !scope) {
            err ? callback(TError(err, true, err.status || status, scope), null) :
                callback(TError(null, true, 'Scope is null', status), null);
            return;
        }
        return callback(null, scope);
    });
}

// Проверка авторизации пользователя по токену
function UserAuth(header_auth , callback) {
    log.info('Checker user authorization');
    if (!validator.Validity(header_auth))
        return callback(TError(null, true, 'Header "user-authorization" is undefined', 401), null);
    if (!bearerType.test(header_auth))
        return callback(TError(null, true, 'Isn\'t Bearer token', 400), null);
    
    const token =  String(header_auth);
    token = token.slice(7);
    return strategy.CheckUser(token, function(err, status, user) {
        if (err || !user) {
            err ? callback(err, status, null) :
                callback(TError(null, true, 'User is null', 400), null);
            return;
        }
        return callback(null, 200, user);
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Выбор сервисной авторизации
function choiceSAuth(header_auth, callback) {
    const type = basicType.test(header_auth);
    if (type)
        return basicAuth(header_auth, callback);
    else if (bearerType.test(header_auth))
        return bearerAuth(header_auth, callback);
    return callback(new Error('Unknown authorization type'), 400, null);
}

// Проверка авторизации по appId и appSecret
function basicAuth(header_auth, callback) {
    const service = basic.parse(header_auth);
    strategy.CheckService(service, function(err, status, app) {
        if (err || !app) {
            err ? callback(err, status, null) : 
                callback(new Error('Service data is null'), 400, null);
            return;
        }
        strategy.SetNewAToken(app, function(err, status, scope) {
            if (err || !scope) {
                err ? callback(err, status, null) : 
                    callback(new Error('Service data is null'), 400, null);
                return;
            }
            return callback(null, 200, scope);
        });
    });
}

// Проверка авторизации по токену
function bearerAuth(header_auth, callback) {
    const service = String(header_auth);
    service = service.slice(7);
    strategy.CheckServiceByToken(service, function(err, status, token) {
        if (err || !token) {
            err ? callback(err, status, null) : 
                callback(new Error('Token is null'), 400, null);
            return;
        }
        return callback(null, status, token);
    });
}

// Проверка на совпадение с нужным типом
function checkResType(type, needed) {
    if (type === needed)
        return true;
    return false;
}