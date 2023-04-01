import Styles from './survey-result-styles.scss';
import { type LoadSurveyResult } from '@/domain/usecases';
import { Header, Footer, Loading, Calendar, Error } from '@/presentation/components';
import FlipMove from 'react-flip-move';
import React, { useEffect, useState } from 'react';

type Props = {
	loadSurveyResult: LoadSurveyResult
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }: Props) => {
	const [state] = useState({
		isLoading: false,
		error: '',
		surveyResult: null as LoadSurveyResult.Model
	});

	useEffect(() => {
		loadSurveyResult.load()
			.then()
			.catch();
	}, []);

	return (
		<div className={Styles.surveyResultWrap}>
			<Header />
			<div data-testid="survey-result" className={Styles.contentWrap}>
				{state.surveyResult &&
					<>
						<hgroup>
							<Calendar date={new Date()} className={Styles.calendarWrap} />
							<h2>Qual é seu framework web favorito? Qual é seu framework web favorito?</h2>
						</hgroup>
						<FlipMove className={Styles.answersList}>
							<li>
								<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png?20220125121207" />
								<span className={Styles.answer}>ReactJS</span>
								<span className={Styles.percent}>50%</span>
							</li>
							<li className={Styles.active}>
								<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png?20220125121207" />
								<span className={Styles.answer}>ReactJS</span>
								<span className={Styles.percent}>50%</span>
							</li>
							<li>
								<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png?20220125121207" />
								<span className={Styles.answer}>ReactJS</span>
								<span className={Styles.percent}>50%</span>
							</li>
						</FlipMove >
						<button>Voltar</button>
					</>
				}
				{ state.isLoading && <Loading /> }
				{/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
				{ state.error && <Error error={state.error} reload={() => {}} /> }
			</div>
			<Footer />
		</div>
	);
};

export default SurveyResult;
