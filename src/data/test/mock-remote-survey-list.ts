import faker from 'faker';
import { type RemoteLoadSurveyList } from '@/data/usecases';

export const mockRemoteSurveyModel = (): RemoteLoadSurveyList.Model => ({
	id: faker.datatype.uuid(),
	question: faker.random.words(10),
	didAnswer: faker.datatype.boolean(),
	date: faker.date.recent().toISOString()
});

export const mockRemoteSurveyListModel = (): RemoteLoadSurveyList.Model[] => ([
	mockRemoteSurveyModel(),
	mockRemoteSurveyModel(),
	mockRemoteSurveyModel()
]);
