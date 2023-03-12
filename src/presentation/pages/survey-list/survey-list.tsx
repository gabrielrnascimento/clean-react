import Styles from './survey-list-styles.scss';
import { Footer } from '@/presentation/components';
import Header from '@/presentation/components/header/header';
import { Error, SurveyContext, SurveyListItem } from '@/presentation/pages/survey-list/components';
import { type LoadSurveyList } from '@/domain/usecases';
import { AccessDeniedError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { useHistory } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

type Props = {
	loadSurveyList: LoadSurveyList
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
	const history = useHistory();
	const { setCurrentAccount } = useContext(ApiContext);
	const [state, setState] = useState({
		surveys: [] as LoadSurveyList.Model[],
		error: '',
		reload: false
	});

	useEffect(() => {
		loadSurveyList.loadAll()
			.then(surveys => { setState({ ...state, surveys }); })
			.catch(error => {
				if (error instanceof AccessDeniedError) {
					setCurrentAccount(undefined);
					history.replace('/login');
				} else {
					setState({ ...state, error: error.message });
				}
			});
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
