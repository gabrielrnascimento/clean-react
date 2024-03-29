import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { type LoadSurveyResult, type SaveSurveyResult } from '@/domain/usecases';
import { Error, Footer, Header, Loading } from '@/presentation/components';
import { useErrorHandler } from '@/presentation/hooks';
import { SurveyResultData, onSurveyAnswerState, surveyResultState } from '@/presentation/pages/survey-result/components';
import Styles from './survey-result-styles.scss';

type Props = {
	loadSurveyResult: LoadSurveyResult
	saveSurveyResult: SaveSurveyResult
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult, saveSurveyResult }: Props) => {
	const handleError = useErrorHandler((error: Error) => {
		setState(old => ({ ...old, surveyResult: null, isLoading: false, error: error.message }));
	});

	const [state, setState] = useRecoilState(surveyResultState);
	const setOnAnswer = useSetRecoilState(onSurveyAnswerState);

	const onAnswer = (answer: string): void => {
		if (state.isLoading) {
			return;
		}
		setState(old => ({ ...old, isLoading: true }));
		saveSurveyResult.save({ answer })
			.then(surveyResult => { setState(old => ({ ...old, isLoading: false, surveyResult })); })
			.catch(handleError);
	};

	useEffect(() => {
		setOnAnswer({ onAnswer });
	}, []);

	const reload = (): void => { setState(old => ({ isLoading: false, surveyResult: null, error: '', reload: !old.reload })); };

	useEffect(() => {
		loadSurveyResult.load()
			.then(surveyResult => { setState(old => ({ ...old, surveyResult })); })
			.catch(handleError);
	}, [state.reload]);

	return (
		<div className={Styles.surveyResultWrap}>
			<Header />
			<div data-testid="survey-result" className={Styles.contentWrap}>
				{state.surveyResult && <SurveyResultData surveyResult={state.surveyResult } /> }
				{ state.isLoading && <Loading /> }
				{ state.error && <Error error={state.error} reload={reload} /> }
			</div>
			<Footer />
		</div>
	);
};

export default SurveyResult;
