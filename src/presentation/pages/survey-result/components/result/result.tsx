import Styles from './result-styles.scss';
import { type LoadSurveyResult } from '@/domain/usecases';
import { Calendar } from '@/presentation/components';
import { SurveyResultAnswer } from '@/presentation/pages/survey-result/components/';
import FlipMove from 'react-flip-move';
import React from 'react';
import { useHistory } from 'react-router-dom';

type Props = {
	surveyResult: LoadSurveyResult.Model
};

const Result: React.FC<Props> = ({ surveyResult }: Props) => {
	const { goBack } = useHistory();

	return (
		<div className={Styles.resultWrap}>
			<>
				<hgroup>
					<Calendar date={surveyResult.date} className={Styles.calendarWrap} />
					<h2 data-testid="question">{surveyResult.question}</h2>
				</hgroup>
				<FlipMove data-testid="answers" className={Styles.answersList}>
					<>
						{surveyResult.answers.map(answer => <SurveyResultAnswer key={answer.answer} answer={answer} />)}
					</>
				</FlipMove >
				<button className={Styles.button} data-testid="back-button" onClick={goBack} >Voltar</button>
			</>
		</div>
	);
};

export default Result;
