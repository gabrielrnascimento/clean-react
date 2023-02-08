import { Authentication, AuthenticationParams } from '@/domain/usecases/authentication';
import { AccountModel } from '@/domain/models/account-model';
import { mockAccountModel } from '@/domain/test';

export class AuthenticationSpy implements Authentication {
	account = mockAccountModel();
	params: AuthenticationParams;
	callsCount = 0;

	async auth (params: AuthenticationParams): Promise<AccountModel> {
		this.params = params;
		this.callsCount++;
		return Promise.resolve(this.account);
	}
}
