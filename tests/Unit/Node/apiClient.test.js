const ApiClient = require('../../../src/Node/Domain/ApiClient');

describe('ApiClient', () => {
    let apiClient;

    beforeEach(() => {
        apiClient = new ApiClient();
    });

    test('should return response data when request is successful', async () => {
        const mockResponse = { data: { success: true } };
        apiClient.client = jest.fn().mockResolvedValue(mockResponse);

        const result = await apiClient.request({ url: 'https://test.com' });
        expect(result).toEqual({ data: mockResponse.data });
    });

    test('should return error object when request fails', async () => {
        const mockError = { response: { status: 500, data: 'error data' } };
        apiClient.client = jest.fn().mockRejectedValue(mockError);

        const result = await apiClient.request({ url: 'https://test.com' });
        expect(result.error).toBe(true);
        expect(result.message).toBe("External API Error");
    });

    test('should return default error when request fails without response', async () => {
        const mockError = new Error('Network Error');
        apiClient.client = jest.fn().mockRejectedValue(mockError);

        const result = await apiClient.request({ url: 'https://test.com' });
        expect(result.error).toBe(true);
        expect(result.message).toBe("Connection Failed");
    });

    test('should block internal addresses', async () => {
        await expect(apiClient.request({ url: 'http://localhost' }))
            .rejects.toThrow('Access to internal address blocked');
        
        await expect(apiClient.request({ url: 'http://192.168.1.1' }))
            .rejects.toThrow('Access to internal address blocked');
    });

    test('should block invalid protocols', async () => {
        await expect(apiClient.request({ url: 'ftp://test.com' }))
            .rejects.toThrow('Invalid protocol');
    });
});
