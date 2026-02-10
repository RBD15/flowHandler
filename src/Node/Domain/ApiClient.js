const axios = require('axios')

class ApiClient{
    async request({ method, url, headers, body }){
        const axiosConfig = { method, url, headers }
        if(['post','put','patch'].includes(method) && body !== null && body !== undefined){
            axiosConfig.data = body
        }
        return axios(axiosConfig)
    }
}

module.exports = ApiClient
