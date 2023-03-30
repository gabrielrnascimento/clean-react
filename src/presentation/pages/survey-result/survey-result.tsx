import Styles from './survey-result-styles.scss';
import { Header, Footer, Loading } from '@/presentation/components';
import FlipMove from 'react-flip-move';
import React from 'react';

const SurveyResult: React.FC = () => {
	return (
		<div className={Styles.surveyResultWrap}>
			<Header />
			<div className={Styles.contentWrap}>
				<h2>Qual é seu framework web favorito?</h2>
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
				<Loading />
				{/* { false && <Loading /> } */}
			</div>
			<Footer />
		</div>
	);
};

export default SurveyResult;
