import { RemoteSaveSurveyResult } from '@/data/usecases';
import { type SaveSurveyResult } from '@/domain/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories/http';

export const makeRemoteSaveSurveyResult = (id: string): SaveSurveyResult => {
	return new RemoteSaveSurveyResult(makeApiUrl(`/surveys/${id}/results`), makeAuthorizeHttpClientDecorator());
};
