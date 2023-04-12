import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters';
import { makeLogin, makeSignUp, makeSurveyList, makeSurveyResult } from '@/main/factories/pages';
import { PrivateRoute, currentAccountState } from '@/presentation/components';

const Router: React.FC = () => {
	const state = {
		setCurrentAccount: setCurrentAccountAdapter,
		getCurrentAccount: getCurrentAccountAdapter
	};
	return (
		<RecoilRoot initializeState={({ set }) => { set(currentAccountState, state); }}>
			<BrowserRouter>
				<Switch>
					<Route path='/login' exact component={makeLogin} />
					<Route path='/signup' exact component={makeSignUp} />
					<PrivateRoute path='/' exact component={makeSurveyList} />
					<PrivateRoute path='/surveys/:id' component={makeSurveyResult} />
				</Switch>
			</BrowserRouter>
		</RecoilRoot>
	);
};

export default Router;
