const axios = require('axios')

class ApiClient{
    constructor() {
        this.client = axios;
        this.timeout = 10000; // 10s default
        this.maxBodySize = 1024 * 1024; // 1MB default
    }

    #validateUrl(url) {
        try {
            const parsed = new URL(url);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                throw new Error(`Invalid protocol: ${parsed.protocol}`);
            }
            
            const hostname = parsed.hostname.toLowerCase();
            const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
            if (blocked.includes(hostname) || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
                // simple anti-ssrf check for common private ranges
                throw new Error(`Access to internal address blocked: ${hostname}`);
            }
        } catch (e) {
            throw new Error(`Invalid URL or Security violation: ${e.message}`);
        }
    }

    async request({ method, url, headers, body }){
        this.#validateUrl(url);

        const axiosConfig = { 
            method, 
            url, 
            headers,
            timeout: this.timeout,
            maxContentLength: this.maxBodySize,
            maxBodyLength: this.maxBodySize
        }

        if(['post','put','patch'].includes(method) && body !== null && body !== undefined){
            axiosConfig.data = body
        }

        try {
            const response = await this.client(axiosConfig);
            // Normalize response to always return an object with data
            return { data: response.data }; 
        } catch (error) {
            // Normalize network/http errors to avoid leaking sensitive stack traces
            if (error.response) {
                return { 
                    error: true,
                    status: error.response.status,
                    message: "External API Error"
                };
            }
            return { 
                error: true,
                message: error.code === 'ECONNABORTED' ? 'Request Timeout' : 'Connection Failed'
            };
        }
    }
}

module.exports = ApiClient
