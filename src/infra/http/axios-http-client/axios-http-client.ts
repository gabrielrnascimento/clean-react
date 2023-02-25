import { type HttpGetParams, type HttpPostClient, type HttpPostParams, type HttpResponse } from '@/data/protocols/http';
import axios, { type AxiosResponse } from 'axios';

export class AxiosHttpClient implements HttpPostClient {
	async post (params: HttpPostParams): Promise<HttpResponse> {
		let AxiosResponse: AxiosResponse;
		try {
			AxiosResponse = await axios.post(params.url, params.body);
		} catch (error) {
			AxiosResponse = error.response;
		}
		return {
			statusCode: AxiosResponse.status,
			body: AxiosResponse.data
		};
	}

	async get (params: HttpGetParams): Promise<void> {
		await axios.get(params.url);
	}
}
