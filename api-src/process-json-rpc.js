const _ = require('lodash');

const JSON_RPC_VERSION = '2.0';
const METHOD_INVOCATION_ERROR_CODE = -32000;

/**
 * @typedef {null | number | string} RpcId
 *
 * @typedef {Object} RpcRequest - rpc запрос
 * @property {string} jsonrpc - версия json rpc, должна быть "2.0"
 * @property {RpcId} id - id запроса
 * @property {string} method - список доступных методов
 * @property {Object} params - payload запроса
 *
 * @typedef {Object} RpcSuccessResponse - успешный rpc ответ
 * @property {string} jsonrpc - версия json rpc, должна быть "2.0"
 * @property {RpcId} id - id запроса
 * @property {any} result - payload с резульатом
 *
 * @typedef {Object} RpcError
 * @property {number} code
 * @property {string} message
 * @property {Object} [data]
 *
 * @typedef {Object} RpcErrorResponse - ответ с ошибкой
 * @property {string} jsonrpc - версия json rpc, должна быть "2.0"
 * @property {RpcId} id - id запроса
 * @property {RpcError} error - ошибка
 *
 * @typedef { RpcSuccessResponse | RpcErrorResponse } RpcResponse
 * @typedef { (params?: Object) => Promise<any> } RpcMethod
 *
 * @typedef {Object.<string, RpcMethod>} RpcMethods
 */

/**
 * Обработка 1 json rpc запрос
 * @param {RpcMethods} methods
 * @param {RpcRequest} request
 * @return {Promise<RpcResponse>}
 */
const processSingle = (methods, request) => {
    const { id, jsonrpc, method, params } = request;

    if (!id || jsonrpc !== JSON_RPC_VERSION) {
        return Promise.resolve({
            id: null,
            jsonrpc: JSON_RPC_VERSION,
            error: {
                code: -32600,
                message: 'Invalid Request',
            },
        });
    }

    if (!_.has(methods, method)) {
        return Promise.resolve({
            id,
            jsonrpc: JSON_RPC_VERSION,
            error: {
                code: -32601,
                message: 'Method not found',
            },
        });
    }

    return methods[method](params)
        .then(result => ({
            id,
            jsonrpc: JSON_RPC_VERSION,
            result,
        }))
        .catch(({ message = 'Unknown error during method invocation' } = {}) => ({
            id,
            jsonrpc: JSON_RPC_VERSION,
            error: {
                message,
                code: message === 'Invalid Params' ? -32602 : METHOD_INVOCATION_ERROR_CODE,
            },
        }));
};

/**
 * Обработчик batch запроса
 * Пример тела запроса:
 * ```
 * {	
 *   "method": "addPurchase",
 *   "id": 123,
 *   "jsonrpc": "2.0",
 *   "params": {
 *      
 *     "buyerId": "glebkaf",
 *     "price": "1000",
 *     "debtorsIds": ["glebkaf", "anikin_antosha"]
 *   }
 * }
 * 
 * @param {RpcMethods} methods
 * @param {RpcRequest[]} requests
 * @return {Promise<RpcResponse[]>}
 */
const processBatch = (methods, requests) =>
    Promise.all(requests.map(request => processSingle(methods, request)));

/**
 * Функция для обработки json rpc запросов
 *
 * @param {RpcMethods} methods - Список доступных методов
 * @param {RpcRequest | RpcRequest[]} request - объект rpc запроса
 * @return {Promise<RpcResponse | RpcResponse[]>}
 */
module.exports = methods => request => Array.isArray(request)
    ? processBatch(methods, request)
    : processSingle(methods, request);
