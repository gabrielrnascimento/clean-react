import { type SetStorage } from '@/data/protocols/cache/set-storage';
import { UnexpectedError } from '@/domain/errors';
import { type AccountModel } from '@/domain/models';
import { type UpdateCurrentAccount } from '@/domain/usecases/update-current-account';

export class LocalUpdateCurrentAccount implements UpdateCurrentAccount {
	constructor (private readonly setStorage: SetStorage) {}

	async save (account: AccountModel): Promise<void> {
		if (!account?.accessToken) {
			throw new UnexpectedError();
		}
		await this.setStorage.set('account', JSON.stringify(account));
	}
}
