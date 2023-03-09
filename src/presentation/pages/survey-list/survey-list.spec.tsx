import SurveyList from '@/presentation/pages/survey-list/survey-list';
import { type SurveyModel } from '@/domain/models';
import { type LoadSurveyList } from '@/domain/usecases';
import { mockSurveyListModel } from '@/domain/test';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

class LoadSurveyListSpy implements LoadSurveyList {
	callsCount = 0;
	surveys = mockSurveyListModel();

	async loadAll (): Promise<SurveyModel[]> {
		this.callsCount++;
		return this.surveys;
	}
}

type SutTypes = {
	loadSurveyListSpy: LoadSurveyListSpy
};

const makeSut = (): SutTypes => {
	const loadSurveyListSpy = new LoadSurveyListSpy();
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
	});
});
