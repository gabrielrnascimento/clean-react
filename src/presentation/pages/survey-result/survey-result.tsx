import { type SaveSurveyResult, type LoadSurveyResult } from '@/domain/usecases';
import { Header, Footer, Loading, Error } from '@/presentation/components';
import { useErrorHandler } from '@/presentation/hooks';
import { SurveyResultContext, SurveyResultData } from '@/presentation/pages/survey-result/components';
import Styles from './survey-result-styles.scss';
import React, { useEffect, useState } from 'react';

type Props = {
	loadSurveyResult: LoadSurveyResult
	saveSurveyResult: SaveSurveyResult
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult, saveSurveyResult }: Props) => {
	const handleError = useErrorHandler((error: Error) => {
		setState(old => ({ ...old, surveyResult: null, isLoading: false, error: error.message }));
	});

	const [state, setState] = useState({
		isLoading: false,
		error: '',
		surveyResult: null as LoadSurveyResult.Model,
		reload: false
	});

	const onAnswer = (answer: string): void => {
		setState(old => ({ ...old, isLoading: true }));
		saveSurveyResult.save({ answer })
			.then()
			.catch(handleError);
	};

	const reload = (): void => { setState(old => ({ isLoading: false, surveyResult: null, error: '', reload: !old.reload })); };

	useEffect(() => {
		loadSurveyResult.load()
			.then(surveyResult => { setState(old => ({ ...old, surveyResult })); })
			.catch(handleError);
	}, [state.reload]);

	return (
		<div className={Styles.surveyResultWrap}>
			<Header />
			<SurveyResultContext.Provider value={{ onAnswer }}>
				<div data-testid="survey-result" className={Styles.contentWrap}>
					{state.surveyResult && <SurveyResultData surveyResult={state.surveyResult } /> }
					{ state.isLoading && <Loading /> }
					{ state.error && <Error error={state.error} reload={reload} /> }
				</div>
			</SurveyResultContext.Provider>
			<Footer />
		</div>
	);
};

export default SurveyResult;
