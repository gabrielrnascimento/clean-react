import Styles from './survey-list-styles.scss';
import { Footer } from '@/presentation/components';
import Header from '@/presentation/components/header/header';
import { Error, SurveyContext, SurveyListItem } from '@/presentation/pages/survey-list/components';
import { useErrorHandler } from '@/presentation/hooks';
import { type LoadSurveyList } from '@/domain/usecases';
import React, { useEffect, useState } from 'react';

type Props = {
	loadSurveyList: LoadSurveyList
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
	const handleError = useErrorHandler((error: Error) => {
		setState(old => ({ ...old, error: error.message }));
	});
	const [state, setState] = useState({
		surveys: [] as LoadSurveyList.Model[],
		error: '',
		reload: false
	});

	useEffect(() => {
		loadSurveyList.loadAll()
			.then(surveys => { setState(old => ({ ...old, surveys })); })
			.catch(handleError);
	}, [state.reload]);

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
