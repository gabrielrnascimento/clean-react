import SurveyList from '@/presentation/pages/survey-list/survey-list';
import { LoadSurveyListSpy } from '@/domain/test';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UnexpectedError } from '@/domain/errors';

type SutTypes = {
	loadSurveyListSpy: LoadSurveyListSpy
};

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
	render(<SurveyList loadSurveyList={loadSurveyListSpy} />);
	return {
		loadSurveyListSpy
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

	test('Should render error on failure', async () => {
		const loadSurveyListSpy = new LoadSurveyListSpy();
		const error = new UnexpectedError();
		jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error);
		makeSut(loadSurveyListSpy);
		await waitFor(() => screen.getAllByRole('heading'));
		expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument();
		expect(screen.getByTestId('error')).toHaveTextContent(error.message);
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
