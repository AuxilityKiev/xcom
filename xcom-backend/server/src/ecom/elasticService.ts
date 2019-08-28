import { Client, SearchResponse } from 'elasticsearch'
import { Service } from 'typedi'

import { ELASTIC_SEARCH_URL } from '../config/env.config'

@Service()
export class ElasticSearchService<T> {
    private readonly elasticClient: Client

    constructor() {
        this.elasticClient = new Client({ host: ELASTIC_SEARCH_URL, log: 'info' })
    }

    public async upsert(index: string, type: string, id: string, body: T): Promise<void> {
        await this.elasticClient.update({
            index,
            type,
            id,
            body: {
                doc: body,
                doc_as_upsert: true
            }
        })
    }

    public async searchByMatch(
        property: string,
        searchQuery: string,
        index: string,
        type: string
    ): Promise<SearchResponse<T>> {
        return this.elasticClient.search<T>({
            index,
            type,
            body: {
                query: {
                    match: {
                        [property]: searchQuery,
                        fuzziness: 'AUTO'
                    }
                }
            }
        })
    }

    public async searchByMultiMatch(
        properties: string[],
        searchQuery: string,
        index: string,
        type: string
    ): Promise<SearchResponse<T>> {
        return this.elasticClient.search<T>({
            index,
            type,
            body: {
                query: {
                    multi_match: {
                        query: searchQuery,
                        fields: properties,
                        fuzziness: 'AUTO'
                    }
                }
            }
        })
    }
}
