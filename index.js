angular.module('nextopia-ng-sdk', [])
    .factory("Nextopia", Nextopia);

function Nextopia($resource, nextopia_client_id, $window, $q, $http) {
    var service = {
        Search: _search,
        GetMeta: _getMeta,
        SetGlobalParam: _setGlobalParam,
        ResetGlobalParams: _resetGlobalParams,
        RemoveGlobalParam: _removeGlobalParam
    };

    var possibleParams = [
        'client_id',
        'page',
        'keywords',
        'ip',
        'user_agent',
        'abstracted_fields',
        'force_or_search',
        'initial_sort',
        'initial_sort_order',
        'no_metaphones',
        'no_stemming',
        'refinements',
        'requested_fields',
        'res_per_page',
        'searchtype',
        'sort_by_field',
        'trim_length',
        'trimmed_fields',
        'compact_refines',
        'custom_ranges',
        'pagination_refines',
        'refines_mode',
        'requested_refines',
        'return_single_refines',
        'disable_merchandising',
        'ignore_redirects',
        'refine',
        'spellcheck',
        'synonym',
        'cache_call',
        'min_max_values',
        'related_searches'
    ];

    function getIp() {
        var deferred = $q.defer();
        var json = 'http://ipv4.myexternalip.com/json';
        $http.get(json).then(function(result) {
            deferred.resolve(result.data.ip);
        });
        return deferred.promise;
    }
    var global_params = {
        client_id: nextopia_client_id, //constant to be set at runtime,
        user_agent: $window.navigator.userAgent
    };
    getIp()
        .then(function(data) {
            global_params.ip = data;
        });


    function _setGlobalParam(param, value) {
        if (possibleParams.indexOf(param) > -1 && ['string', 'number', 'boolean'].indexOf(typeof value) > -1) {
            global_params[param] = value;
        } else {
            console.log('param or value invalid')
        }
    }

    function _resetGlobalParams() {
        global_params = {
            client_id: nextopia_client_id,
            user_agent: $window.navigator.userAgent,
            ip: global_params.ip
        }
    }

    function _removeGlobalParam(param) {
        if (global_params[param] && ['client_id', 'user_agent', 'ip'].indexOf(param) == -1) {
            delete global_params[param];
        }
    }
    function _getMeta() {
        var params = {
            client_id: nextopia_client_id,
            user_agent: $window.navigator.userAgent,
            ip: global_params.ip,
            callback: "JSON_CALLBACK",
            json: 1,
            nav_search: 1,
            res_per_page: 1
        };
        return $resource('https://ecommerce-search.nextopiasoftware.com/return-results.php?', params, {call: {method: "JSONP"}}).call().$promise.then(function(data) {data.results ? delete data.results : angular.noop(); return data});
    }

    function _search(custom_params) {
        var final_query = combineQueryObjects(custom_params,global_params);
        final_query.callback = "JSON_CALLBACK";
        return $resource('https://ecommerce-search.nextopiasoftware.com/return-results.php?json=1', final_query, {call: {method: 'JSONP', headers: {"access-control-allow-origin": $window.location.origin}}}).call().$promise;
    }

    function combineQueryObjects(custom, global) {
        var query = {};
        for (var key in global) {
            query[key] = global[key];
        }
        console.log(global);
        for (var key in custom) {
            query[key] = custom[key];
        }
        console.log(global);
        return query;
    }

    return service;
}
