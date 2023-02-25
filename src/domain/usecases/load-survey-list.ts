import { type SurveyModel } from '../models';

export interface LoadSurveyList {
	loadAll: () => Promise<SurveyModel[]>
}
