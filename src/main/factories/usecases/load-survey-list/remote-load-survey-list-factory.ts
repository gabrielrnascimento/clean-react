import { makeApiUrl } from '@/main/factories/http';
import { type LoadSurveyList } from '@/domain/usecases';
import { RemoteLoadSurveyList } from '@/data/usecases';
import { makeAuthorizeHttpGetClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadSurveyList = (): LoadSurveyList => {
	return new RemoteLoadSurveyList(makeApiUrl('/surveys'), makeAuthorizeHttpGetClientDecorator());
};
