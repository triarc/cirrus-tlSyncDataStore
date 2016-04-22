declare module "tlSyncDataStore" {
    export interface IChangeSet<T, TKey> {
        added: T[];
        updated: T[];
        deleted: TKey[];
    }
}
