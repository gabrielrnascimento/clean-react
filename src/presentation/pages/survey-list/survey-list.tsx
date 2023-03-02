import Styles from './survey-list-styles.scss';
import { Footer } from '@/presentation/components';
import Header from '@/presentation/components/header/header';
import { SurveyItemEmpty } from '@/presentation/pages/survey-list/components';
import { type LoadSurveyList } from '@/domain/usecases';
import React, { useEffect } from 'react';

type Props = {
	loadSurveyList: LoadSurveyList
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
	useEffect(() => {
		(async function () {
			loadSurveyList.loadAll();
		})();
	}, []);
	return (
		<div className={Styles.surveyListWrap}>
			<Header />
			<div className={Styles.contentWrap}>
				<h2>Enquetes</h2>
				<ul data-testid="survey-list">
					<SurveyItemEmpty />
				</ul>
			</div>
			<Footer />
		</div>
	);
};

export default SurveyList;
