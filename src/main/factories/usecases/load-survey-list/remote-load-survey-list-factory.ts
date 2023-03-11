import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http';
import { type LoadSurveyList } from '@/domain/usecases';
import { RemoteLoadSurveyList } from '@/data/usecases';

export const makeRemoteLoadSurveyList = (): LoadSurveyList => {
	return new RemoteLoadSurveyList(makeApiUrl('/surveys'), makeAxiosHttpClient());
};
