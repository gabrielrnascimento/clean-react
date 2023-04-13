
import { render } from '@testing-library/react';
import { type MemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { type AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';
import { currentAccountState } from '@/presentation/components';

type Params = {
	Page: React.FC
	history: MemoryHistory
	account?: AccountModel
};

type Result = {
	setCurrentAccountMock: (account: AccountModel) => void
};

export const renderWithHistory = ({ Page, history, account = mockAccountModel() }: Params): Result => {
	const setCurrentAccountMock = jest.fn();
	const mockedState = {
		setCurrentAccount: setCurrentAccountMock,
		getCurrentAccount: () => account
	};

	render(
		<RecoilRoot initializeState={({ set }) => { set(currentAccountState, mockedState); }}>
			<Router history={history}>
				<Page />
			</Router>
		</RecoilRoot>
	);
	return {
		setCurrentAccountMock
	};
};
