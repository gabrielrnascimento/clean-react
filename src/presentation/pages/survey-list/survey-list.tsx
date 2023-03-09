import Styles from './survey-list-styles.scss';
import { Footer } from '@/presentation/components';
import Header from '@/presentation/components/header/header';
import { Error, SurveyContext, SurveyListItem } from '@/presentation/pages/survey-list/components';
import { type LoadSurveyList } from '@/domain/usecases';
import React, { useEffect, useState } from 'react';
import { type SurveyModel } from '@/domain/models';

type Props = {
	loadSurveyList: LoadSurveyList
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
	const [state, setState] = useState({
		surveys: [] as SurveyModel[],
		error: ''
	});

	useEffect(() => {
		loadSurveyList.loadAll()
			.then(surveys => { setState({ ...state, surveys }); })
			.catch(error => { setState({ ...state, error: error.message }); });
	}, []);

	return (
		<div className={Styles.surveyListWrap}>
			<Header />
			<div className={Styles.contentWrap}>
				<h2>Enquetes</h2>
				<SurveyContext.Provider value={{ state, setState }}>
					{ state.error ? <Error /> : <SurveyListItem /> }
				</SurveyContext.Provider>
			</div>
			<Footer />
		</div>
	);
};

export default SurveyList;
