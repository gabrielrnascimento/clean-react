import { SurveyResult } from '@/presentation/pages';
import ApiContext from '@/presentation/contexts/api/api-context';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { mockAccountModel } from '@/domain/test';

const makeSut = (): void => {
	render(
		<ApiContext.Provider value={{ setCurrentAccount: jest.fn(), getCurrentAccount: () => mockAccountModel() }}>
			<SurveyResult />
		</ApiContext.Provider>
	);
};

describe('SurveyResult Component', () => {
	test('Should present correct initial state', async () => {
		makeSut();
		const surveyResult = screen.getByTestId('survey-result');
		expect(surveyResult.childElementCount).toBe(0);
		expect(screen.queryByTestId('error')).not.toBeInTheDocument();
		expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
	});
});
