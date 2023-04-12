import { RemoteLoadSurveyResult } from '@/data/usecases';
import { type LoadSurveyResult } from '@/domain/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories/http';

export const makeRemoteLoadSurveyResult = (id: string): LoadSurveyResult => {
	return new RemoteLoadSurveyResult(makeApiUrl(`/surveys/${id}/results`), makeAuthorizeHttpClientDecorator());
};
