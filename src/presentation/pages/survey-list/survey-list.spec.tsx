import SurveyList from '@/presentation/pages/survey-list/survey-list';
import { render, screen } from '@testing-library/react';
import React from 'react';

const makeSut = (): void => {
	render(<SurveyList />);
};

describe('SurveyListComponent', () => {
	test('Should present 4 empty items on start', () => {
		makeSut();
		const surveyList = screen.getByTestId('survey-list');
		expect(surveyList.querySelectorAll('li:empty').length).toBe(4);
	});
});
