import { createContext } from 'react';
import { type AccountModel } from '@/domain/models';

type Props = {
	setCurrentAccount?: (account: AccountModel) => void
	getCurrentAccount?: () => AccountModel
};

export default createContext<Props>(null);
