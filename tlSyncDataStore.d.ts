declare module Triarc.Sync {
    enum ESyncKind {
        ReadOnly = 0,
        ReadUpdate = 1,
    }
    enum EFieldType {
        Text = 0,
        Numeric = 1,
        Date = 2,
        Boolean = 3,
        JsonObject = 4,
        JsonArray = 5,
        FloatingNumeric = 6,
    }
    interface ISyncField {
        name: string;
        fieldType: EFieldType;
        dbType: string;
        index?: boolean;
    }
    interface ISyncTypeCollection {
        types: ISyncType[];
        name: string;
        controller: string;
        action: string;
        deleteOnUnregister: boolean;
    }
    interface ISyncType {
        fields: ISyncField[];
        name: string;
        mapperJavaClass?: string;
        timestampColumn: string;
        notificationMethod?: string;
    }
    interface IListenCallback<T, TKey> {
        changeSet: IChangeSet<T, TKey>;
        notificationId: string;
    }
    interface ISyncDataStore {
        initialize(webApiPath: string, syncTypes: ISyncTypeCollection[], versionNumber: string, success?: () => void, error?: (err: string) => void): any;
        register(cookie: string, success?: (err: string) => void, error?: (err: string) => void): any;
        resetDb(success?: () => void, error?: (err: string) => void): any;
        unRegister(success?: () => void, error?: (err: string) => void): any;
        requestSync(success?: () => void, error?: (err: string) => void): any;
        getLastUpdateTimestamp(collectionName: string, success?: (timestamp: string) => void, error?: (err: string) => void): any;
        isSyncing(success?: (isSyncing: string) => void, error?: (err: string) => void): any;
        listen(typeName: string, success: (changeset: string) => void, error: (err: string) => void): any;
        confirmNotification(typeName: string, success: () => void, error: (err: string) => void): void;
        onError(collectionName: string, success: (errorMessage: string) => void, error: (err: string) => void): any;
        onSyncStateChanged(success: (state: string, collectionName: string) => void, error: (err: string) => void): any;
        createReport(errorDescription: string, success: () => void, error: (err: string) => void): any;
        isAuthenticated(success: (isAuthenticated: string) => void, error: (err: string) => void): any;
        lockSync(sucess: (lockId: string) => void, error: (err: string) => void): any;
        unlockSync(lockId: any, success: () => void, error: (err: string) => void): any;
    }
    interface IChangeSet<T, TKey> {
        added: T[];
        updated: T[];
        deleted: TKey[];
    }
    interface ISyncDataStoreService {
        isSyncCapable: boolean;
        setDebounceInterval(interval: number): any;
        initialize(webApiPath: string, syncTypes: ISyncTypeCollection[], versionNumber: string): angular.IPromise<void>;
        register(cookie: string): angular.IPromise<void>;
        resetDb(): angular.IPromise<void>;
        unRegister(): angular.IPromise<void>;
        requestSync(reason: string, force?: boolean): angular.IPromise<void>;
        getLastUpdateTimestamp(collectionName: string): angular.IPromise<string>;
        isSyncing(): angular.IPromise<boolean>;
        listen(typeName: string, success: (changeset: IListenCallback<any, any>) => void, error: (err: string) => void): void;
        confirmNotification(typeName: string, success: () => void, error: (err: string) => void): void;
        onError(collectionName: string, success: (changeset: string) => void, error: (err: string) => void): void;
        onSyncStateChanged(success: (state: string) => void, error: (err: string) => void): void;
        createReport(errorDescription: string): angular.IPromise<void>;
        isAuthenticated(): angular.IPromise<boolean>;
        lockSync(): angular.IPromise<ISyncLock>;
    }
    interface ISyncLock {
        lockId: string;
        unlock(): angular.IPromise<void>;
    }
}
declare var SyncDataStore: Triarc.Sync.ISyncDataStore;
