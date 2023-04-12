import React from 'react';
import { useParams } from 'react-router-dom';
import { makeRemoteLoadSurveyResult, makeRemoteSaveSurveyResult } from '@/main/factories/usecases';
import { SurveyResult } from '@/presentation/pages';

export const makeSurveyResult: React.FC = () => {
	type Props = {
		id: string
	};
	const { id } = useParams<Props>();
	return (
		<SurveyResult
			loadSurveyResult={makeRemoteLoadSurveyResult(id)}
			saveSurveyResult={makeRemoteSaveSurveyResult(id)}
		/>
	);
};
