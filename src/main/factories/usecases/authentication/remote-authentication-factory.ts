import { RemoteAuthentication } from '@/data/usecases';
import { type Authentication } from '@/domain/usecases/authentication';
import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http';

export const makeRemoteAuthentication = (): Authentication => {
	return new RemoteAuthentication(makeApiUrl('/login'), makeAxiosHttpClient());
};
