app.service('utilsService', function () {
   this.guid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
    this.getQueryStringParams = function(str) {
        var queryString = str || window.location.search || '';
        var keyValPairs = [];
        var params      = {};
        queryString     = queryString.replace(/.*?\?/,"").split('#/')[0];

        if (queryString.length) {
            keyValPairs = queryString.split('&');
            for (pairNum in keyValPairs) {
                var key = keyValPairs[pairNum].split('=')[0];
                if (!key.length) continue;
                if (typeof params[key] === 'undefined')
                    params[key] = [];
                params[key].push(keyValPairs[pairNum].split('=')[1]);
            }
        }
        return params;
    }
    this.isElementInViewport = function (el, offset) {
        var rect = el.getBoundingClientRect();
        if (!(rect.top >= offset.top || 0))
            return false;
        if (!(rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)))
            return false;
        return true;
    }
    this.HashTable = function(obj) {
        this.length = 0;
        this.items = {};
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                this.items[p] = obj[p];
                this.length++;
            }
        }

        this.setItem = function (key, value) {
            var previous = undefined;
            if (this.hasItem(key)) {
                previous = this.items[key];
            } else {
                this.length++;
            }
            this.items[key] = value;
            return previous;
        }

        this.getItem = function (key) {
            return this.hasItem(key) ? this.items[key] : undefined;
        }

        this.hasItem = function (key) {
            return this.items.hasOwnProperty(key);
        }

        this.removeItem = function (key) {
            if (this.hasItem(key)) {
                previous = this.items[key];
                this.length--;
                delete this.items[key];
                return previous;
            } else {
                return undefined;
            }
        }

        this.keys = function () {
            var keys = [];
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    keys.push(k);
                }
            }
            return keys;
        }

        this.values = function () {
            var values = [];
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    values.push(this.items[k]);
                }
            }
            return values;
        }

        this.each = function (fn) {
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    fn(k, this.items[k]);
                }
            }
        }

        this.clear = function () {
            this.items = {}
            this.length = 0;
        }
    }
});
