import axios, { type AxiosResponse } from 'axios';
import { type HttpClient, type HttpRequest, type HttpResponse } from '@/data/protocols/http';

export class AxiosHttpClient implements HttpClient {
	async request (data: HttpRequest): Promise<HttpResponse> {
		let axiosResponse: AxiosResponse;
		try {
			axiosResponse = await axios.request({
				url: data.url,
				method: data.method,
				data: data.body,
				headers: data.headers
			});
		} catch (error) {
			axiosResponse = error.response;
		}
		return {
			statusCode: axiosResponse.status,
			body: axiosResponse.data
		};
	}
}
