import { RemoteAddAccount } from '@/data/usecases';
import { type AddAccount } from '@/domain/usecases';
import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http';

export const makeRemoteAddAccount = (): AddAccount => {
	return new RemoteAddAccount(makeApiUrl('/signup'), makeAxiosHttpClient());
};
