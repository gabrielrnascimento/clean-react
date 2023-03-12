import SurveyList from '@/presentation/pages/survey-list/survey-list';
import { LoadSurveyListSpy, mockAccountModel } from '@/domain/test';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { type AccountModel } from '@/domain/models';
import { Router } from 'react-router-dom';
import { createMemoryHistory, type MemoryHistory } from 'history';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

type SutTypes = {
	loadSurveyListSpy: LoadSurveyListSpy
	history: MemoryHistory
	setCurrentAccountMock: (account: AccountModel) => void
};

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
	const history = createMemoryHistory({ initialEntries: ['/'] });
	const setCurrentAccountMock = jest.fn();
	render(
		<ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel() }}>
			<Router history={history}>
				<SurveyList
					loadSurveyList={loadSurveyListSpy} />
			</Router>
		</ApiContext.Provider>
	);
	return {
		loadSurveyListSpy,
		history,
		setCurrentAccountMock
	};
};

describe('SurveyListComponent', () => {
	test('Should present 4 empty items on start', async () => {
		makeSut();
		const surveyList = screen.getByTestId('survey-list');
		expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
		expect(screen.queryByTestId('error')).not.toBeInTheDocument();
		await waitFor(() => surveyList);
	});

	test('Should call LoadSurveyList', async () => {
		const { loadSurveyListSpy } = makeSut();
		expect(loadSurveyListSpy.callsCount).toBe(1);
		await waitFor(() => screen.getAllByRole('heading'));
	});

	test('Should render SurveyItems on sucess', async () => {
		makeSut();
		const surveyList = screen.getByTestId('survey-list');
		await waitFor(() => surveyList);
		expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(3);
		expect(screen.queryByTestId('error')).not.toBeInTheDocument();
	});

	test('Should render error on UnexpectedError', async () => {
		const loadSurveyListSpy = new LoadSurveyListSpy();
		const error = new UnexpectedError();
		jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error);
		makeSut(loadSurveyListSpy);
		await waitFor(() => screen.getAllByRole('heading'));
		expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument();
		expect(screen.getByTestId('error')).toHaveTextContent(error.message);
	});

	test('Should logout on AccessDeniedError', async () => {
		const loadSurveyListSpy = new LoadSurveyListSpy();
		jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new AccessDeniedError());
		const { setCurrentAccountMock, history } = makeSut(loadSurveyListSpy);
		await waitFor(() => screen.getAllByRole('heading'));
		expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
		expect(history.location.pathname).toBe('/login');
	});

	test('Should call LoadSurveyList on reload', async () => {
		const loadSurveyListSpy = new LoadSurveyListSpy();
		jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new UnexpectedError());
		makeSut(loadSurveyListSpy);
		await waitFor(() => screen.getAllByRole('heading'));
		fireEvent.click(screen.getByTestId('reload'));
		await waitFor(() => screen.getAllByRole('heading'));
		expect(loadSurveyListSpy.callsCount).toBe(1);
	});
});
