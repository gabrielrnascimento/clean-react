import { atom } from 'recoil';
import { type AccountModel } from '@/domain/models';

export const currentAccountState = atom({
	key: 'currentAccountState',
	default: {
		getCurrentAccount: null as () => AccountModel,
		setCurrentAccount: null as (account: AccountModel) => void
	}
});
