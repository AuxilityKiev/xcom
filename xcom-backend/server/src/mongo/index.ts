import { Db, MongoClient } from 'mongodb'

export interface MongoOptions {
    url: string
    dbName: string
}

class Mongo {
    private _db!: Db
    private _client!: MongoClient

    public async connect(options: MongoOptions) {
        this._client = await MongoClient.connect(
            options.url,
            { useNewUrlParser: true }
        )
        this._db = this._client.db(options.dbName)
    }

    public async close() {
        return this._client.close()
    }

    public getDB(dbName: string) {
        return this._client.db(dbName)
    }

    get db() {
        return this._db
    }
}

export default new Mongo()
