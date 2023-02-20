import { type AccountModel } from '@/domain/models/account-model';
import { mockAccountModel } from '@/domain/test';
import { type AuthenticationParams, type AddAccount, type AddAccountParams } from '@/domain/usecases';

export class AddAccountSpy implements AddAccount {
	account = mockAccountModel();
	params: AuthenticationParams;

	async add (params: AddAccountParams): Promise<AccountModel> {
		this.params = params;
		return this.account;
	}
}
