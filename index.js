angular.module('nextopia-sdk')
    .factory("Nextopia", Nextopia);

function Nextopia($resource, nextopia_client_id) {
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

    var global_params = {
        client_id: nextopia_client_id //constant to be set at runtime
    };

    function _setGlobalParam(param, value) {
        if (possibleParams.indexOf(param) > -1 && ['string', 'number', 'boolean'].indexOf(typeof value) > -1) {
            global_params[param] = value;
        } else {
            console.log('param or value invalid')
        }
    }

    function _resetGlobalParams() {
        global_params = {
            client_id: global_params.client_id
        }
    }
    function _removeGlobalParam(param) {
        if (global_params[param]) {
            delete global_params[param];
        }
    }
    function _getMeta() {
        return $resource('http://ecommerce-search.nextopiasoftware.com/return-results.php?json=1&nav_search=1&res_per_page=1').get().$promise.then(function(data) {data.results ? delete data.results : angular.noop(); return data});
    }

    function _search(custom_params) {
        var final_query = combineQueryObjects(custom_params,global_params);
        return $resource('http://ecommerce-search.nextopiasoftware.com/return-results.php?json=1', final_query).get().$promise;
    }

    function combineQueryObjects(custom, global) {
        for (var key in custom) {
            global[key] = custom[key];
        }
        return global;
    }

    return service;
}

