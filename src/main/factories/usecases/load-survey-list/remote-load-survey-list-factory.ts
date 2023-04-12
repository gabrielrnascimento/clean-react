import { RemoteLoadSurveyList } from '@/data/usecases';
import { type LoadSurveyList } from '@/domain/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories/http';

export const makeRemoteLoadSurveyList = (): LoadSurveyList => {
	return new RemoteLoadSurveyList(makeApiUrl('/surveys'), makeAuthorizeHttpClientDecorator());
};
