import { type AuthenticationParams } from '@/domain/usecases/authentication';
import { type AccountModel } from '../models/account-model';
import faker from 'faker';

export const mockAuthentication = (): AuthenticationParams => ({
	email: faker.internet.email(),
	password: faker.internet.password()
});

export const mockAccountModel = (): AccountModel => ({
	accessToken: faker.datatype.uuid()
});
