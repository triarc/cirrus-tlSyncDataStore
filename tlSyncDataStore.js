var Triarc;
(function (Triarc) {
    var Sync;
    (function (Sync) {
        (function (ESyncKind) {
            ESyncKind[ESyncKind["ReadOnly"] = 0] = "ReadOnly";
            ESyncKind[ESyncKind["ReadUpdate"] = 1] = "ReadUpdate";
        })(Sync.ESyncKind || (Sync.ESyncKind = {}));
        var ESyncKind = Sync.ESyncKind;
        (function (EFieldType) {
            EFieldType[EFieldType["Text"] = 0] = "Text";
            EFieldType[EFieldType["Numeric"] = 1] = "Numeric";
            EFieldType[EFieldType["Date"] = 2] = "Date";
            EFieldType[EFieldType["Boolean"] = 3] = "Boolean";
            EFieldType[EFieldType["JsonObject"] = 4] = "JsonObject";
            EFieldType[EFieldType["JsonArray"] = 5] = "JsonArray";
            EFieldType[EFieldType["FloatingNumeric"] = 6] = "FloatingNumeric";
        })(Sync.EFieldType || (Sync.EFieldType = {}));
        var EFieldType = Sync.EFieldType;
        var SyncDataStoreService = (function () {
            function SyncDataStoreService($q) {
                this.$q = $q;
                this.interval = 1000;
                this.timeout = null;
            }
            Object.defineProperty(SyncDataStoreService.prototype, "isSyncCapable", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            SyncDataStoreService.prototype.setDebounceInterval = function (interval) {
                this.interval = interval;
            };
            SyncDataStoreService.prototype.initialize = function (webApiPath, syncTypes, versionNumber) {
                var deferred = this.$q.defer();
                SyncDataStore.initialize(webApiPath, syncTypes, versionNumber, function () { return deferred.resolve(); }, function (err) { return deferred.reject(err); });
                return deferred.promise;
            };
            SyncDataStoreService.prototype.register = function (cookie) {
                var deferred = this.$q.defer();
                SyncDataStore.register(cookie, function () { return deferred.resolve(); }, function (err) { return deferred.reject(err); });
                return deferred.promise;
            };
            SyncDataStoreService.prototype.resetDb = function () {
                var deferred = this.$q.defer();
                SyncDataStore.resetDb(function () { return deferred.resolve(); }, function (err) { return deferred.reject(err); });
                return deferred.promise;
            };
            SyncDataStoreService.prototype.unRegister = function () {
                var deferred = this.$q.defer();
                SyncDataStore.unRegister(function () { return deferred.resolve(); }, function (err) { return deferred.reject(err); });
                return deferred.promise;
            };
            SyncDataStoreService.prototype.requestSync = function (reason, force) {
                var _this = this;
                var deferred = this.$q.defer();
                console.log("request sync called, because:" + reason);
                if (angular.isNumber(this.timeout)) {
                    clearTimeout(this.timeout);
                }
                var sync = function () {
                    SyncDataStore.requestSync(function () { return deferred.resolve(); }, function (err) { return deferred.reject(err); });
                    _this.timeout = null;
                };
                if (force === true) {
                    sync();
                }
                else {
                    this.timeout = setTimeout(function () {
                        sync();
                    }, this.interval);
                }
                return deferred.promise;
            };
            SyncDataStoreService.prototype.getLastUpdateTimestamp = function (collectionName) {
                var deferred = this.$q.defer();
                SyncDataStore.getLastUpdateTimestamp(collectionName, function (timestamp) { return deferred.resolve(timestamp); }, function () { return deferred.reject(); });
                return deferred.promise;
            };
            SyncDataStoreService.prototype.isSyncing = function () {
                var deferred = this.$q.defer();
                SyncDataStore.isSyncing(function (isSyncing) { return deferred.resolve(isSyncing === "true"); }, function (err) { return deferred.reject(err); });
                return deferred.promise;
            };
            SyncDataStoreService.prototype.listen = function (typeName, success, error) {
                var _this = this;
                SyncDataStore.listen(typeName, function (changeSetCallbackString) {
                    var changeSetCallback = angular.fromJson(changeSetCallbackString);
                    var changeSet = changeSetCallback.changeSet;
                    if (changeSet.added.length === 0 && changeSet.updated.length === 0 && changeSet.deleted.length === 0) {
                        _this.confirmNotification(changeSetCallback.notificationId, null, null);
                        return;
                    }
                    Triarc.Data.convertDateStringsToDates(changeSet);
                    try {
                        if (angular.isFunction(success)) {
                            success(changeSetCallback);
                        }
                    }
                    catch (err) {
                        _this.confirmNotification(changeSetCallback.notificationId, null, null);
                    }
                }, error);
            };
            SyncDataStoreService.prototype.confirmNotification = function (notificationId, success, error) {
                SyncDataStore.confirmNotification(notificationId, success, error);
            };
            SyncDataStoreService.prototype.onError = function (collectionName, success, error) {
                SyncDataStore.onError(collectionName, success, error);
            };
            SyncDataStoreService.prototype.onSyncStateChanged = function (success, error) {
                SyncDataStore.onSyncStateChanged(success, error);
            };
            SyncDataStoreService.prototype.createReport = function (errorDescription) {
                var deferred = this.$q.defer();
                SyncDataStore.createReport(errorDescription, function () { return deferred.resolve(); }, function (err) { return deferred.reject(err); });
                return deferred.promise;
            };
            SyncDataStoreService.prototype.isAuthenticated = function () {
                var deferred = this.$q.defer();
                SyncDataStore.isAuthenticated(function (isAuthenticated) { return deferred.resolve(isAuthenticated === "true"); }, function (err) { return deferred.reject(err); });
                return deferred.promise;
            };
            SyncDataStoreService.prototype.lockSync = function () {
                var _this = this;
                var deferred = this.$q.defer();
                SyncDataStore.lockSync(function (lockId) { return deferred.resolve({
                    lockId: lockId,
                    unlock: function () {
                        return _this.unlockSync(lockId);
                    }
                }); }, function (err) { return deferred.reject(err); });
                return deferred.promise;
            };
            SyncDataStoreService.prototype.unlockSync = function (lockId) {
                var deferred = this.$q.defer();
                SyncDataStore.unlockSync(lockId, function () { return deferred.resolve(); }, function () { return deferred.reject(); });
                return deferred.promise;
            };
            SyncDataStoreService.$inject = ["$q"];
            return SyncDataStoreService;
        }());
        Sync.SyncDataStoreService = SyncDataStoreService;
        var MockSyncDataStoreService = (function () {
            function MockSyncDataStoreService($q) {
                this.$q = $q;
            }
            MockSyncDataStoreService.prototype.setDebounceInterval = function (interval) { };
            MockSyncDataStoreService.prototype.initialize = function (webApiPath, syncTypes, versionNumber) {
                return this.$q.when();
            };
            MockSyncDataStoreService.prototype.register = function (cookie) {
                return this.$q.when();
            };
            MockSyncDataStoreService.prototype.resetDb = function () {
                return this.$q.when();
            };
            MockSyncDataStoreService.prototype.unRegister = function () {
                return this.$q.when();
            };
            MockSyncDataStoreService.prototype.requestSync = function (reason, force) {
                return this.$q.when();
            };
            MockSyncDataStoreService.prototype.getLastUpdateTimestamp = function (collectionName) {
                return this.$q.when("0");
            };
            MockSyncDataStoreService.prototype.isSyncing = function () {
                return this.$q.when(false);
            };
            MockSyncDataStoreService.prototype.createReport = function (errorDescription) {
                return this.$q.when();
            };
            MockSyncDataStoreService.prototype.isAuthenticated = function () {
                return this.$q.when(false);
            };
            MockSyncDataStoreService.prototype.lockSync = function () {
                return this.$q.when({
                    lockId: "dummy",
                    unlock: function () { }
                });
            };
            Object.defineProperty(MockSyncDataStoreService.prototype, "isSyncCapable", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            ;
            MockSyncDataStoreService.prototype.listen = function (typeName, success, error) { };
            MockSyncDataStoreService.prototype.confirmNotification = function (typeName, success, error) { };
            MockSyncDataStoreService.prototype.onError = function (collectionName, success, error) { };
            MockSyncDataStoreService.prototype.onSyncStateChanged = function (success, error) { };
            MockSyncDataStoreService.$inject = ["$q"];
            return MockSyncDataStoreService;
        }());
        Sync.MockSyncDataStoreService = MockSyncDataStoreService;
        var mod = angular.module("tlSyncDataStore", []);
        var serviceName = 'tlSyncDataStore';
        if (typeof SyncDataStore !== "undefined") {
            mod.service(serviceName, SyncDataStoreService);
        }
        else {
            mod.service(serviceName, MockSyncDataStoreService);
        }
    })(Sync = Triarc.Sync || (Triarc.Sync = {}));
})(Triarc || (Triarc = {}));

