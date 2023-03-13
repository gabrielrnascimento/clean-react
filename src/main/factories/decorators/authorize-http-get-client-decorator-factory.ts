import { AuthorizeHttpGetClientDecorator } from '@/main/decorators';
import { makeLocalStorageAdapter } from '@/main/factories/cache';
import { makeAxiosHttpClient } from '@/main/factories/http';
import { type HttpGetClient } from '@/data/protocols/http';

export const makeAuthorizeHttpGetClientDecorator = (): HttpGetClient => {
	return new AuthorizeHttpGetClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClient());
};
