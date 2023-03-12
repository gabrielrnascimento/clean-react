import React, { useContext } from 'react';
import Styles from './list-styles.scss';
import { SurveyContext, SurveyItem, SurveyItemEmpty } from '@/presentation/pages/survey-list/components';
import { type LoadSurveyList } from '@/domain/usecases';

const List: React.FC = () => {
	const { state } = useContext(SurveyContext);
	return (
		<ul className={Styles.listWrap} data-testid="survey-list">
			{state.surveys.length
				? state.surveys.map((survey: LoadSurveyList.Model) => <SurveyItem key={survey.id} survey={survey} />)
				: <SurveyItemEmpty />
			}
		</ul>
	);
};

export default List;
