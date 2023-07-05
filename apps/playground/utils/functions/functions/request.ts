import axios from "axios"

export async function request( route: string, parameters, method = 'POST' ) {
    const config = {
        url: `${route}`,
        method,
        [method === 'GET' ? 'params' : 'data']: parameters,
    }

    try {
        const response= await axios.request(config)
        return response.data
    } catch(e ) {
        return { ok: false, message: e.message }
    }
}