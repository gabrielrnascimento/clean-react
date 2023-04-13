
import { render } from '@testing-library/react';
import { type MemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { type MutableSnapshot, RecoilRoot, type RecoilState } from 'recoil';
import { type AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';
import { currentAccountState } from '@/presentation/components';

type Params = {
	Page: React.FC
	history: MemoryHistory
	account?: AccountModel
	states?: Array<{ atom: RecoilState<any>, value: any }>
};

type Result = {
	setCurrentAccountMock: (account: AccountModel) => void
};

export const renderWithHistory = ({ Page, history, account = mockAccountModel(), states = [] }: Params): Result => {
	const setCurrentAccountMock = jest.fn();
	const mockedState = {
		setCurrentAccount: setCurrentAccountMock,
		getCurrentAccount: () => account
	};

	const initializeState = ({ set }: MutableSnapshot): void => {
		[...states, { atom: currentAccountState, value: mockedState }].forEach(state => { set(state.atom, state.value); });
		set(currentAccountState, mockedState);
	};

	render(
		<RecoilRoot initializeState={initializeState}>
			<Router history={history}>
				<Page />
			</Router>
		</RecoilRoot>
	);
	return {
		setCurrentAccountMock
	};
};
