import { atom } from 'recoil';
import { type LoadSurveyList } from '@/domain/usecases';

export const surveyListState = atom({
	key: 'surveyListState',
	default: {
		surveys: [] as LoadSurveyList.Model[],
		error: '',
		reload: false
	}
});
