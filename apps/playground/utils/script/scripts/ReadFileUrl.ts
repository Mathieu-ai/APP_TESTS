import { request } from '../../../utils'

export async function readFileUrl(url: string, param, method: string) {
    return await request(url, param, method)
}