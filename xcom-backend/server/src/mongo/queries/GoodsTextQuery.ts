/**
 * High performance, indexed text search query that searches both
 * partial left-anchored matches and full-text mongo stemmed indexes
 */
export class GoodsTextQuery {
    // noinspection JSMismatchedCollectionQueryUpdate
    private $or?: any[]

    public constructor(query?: string, goodsIds?: number[]) {
        if (query) {
            this.$or = [
                {
                    searchKeywords: new RegExp(
                        '^' + query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&').toLocaleLowerCase()
                    )
                },
                // ids from elasticsearch
                { id: { $in: goodsIds } }
            ]
        }
    }
}
