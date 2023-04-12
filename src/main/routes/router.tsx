import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters';
import { makeLogin, makeSignUp, makeSurveyList, makeSurveyResult } from '@/main/factories/pages';
import { PrivateRoute } from '@/presentation/components';
import { ApiContext } from '@/presentation/contexts';

const Router: React.FC = () => {
	return (
		<RecoilRoot>
			<ApiContext.Provider
				value={{
					setCurrentAccount: setCurrentAccountAdapter,
					getCurrentAccount: getCurrentAccountAdapter
				}}
			>
				<BrowserRouter>
					<Switch>
						<Route path='/login' exact component={makeLogin} />
						<Route path='/signup' exact component={makeSignUp} />
						<PrivateRoute path='/' exact component={makeSurveyList} />
						<PrivateRoute path='/surveys/:id' component={makeSurveyResult} />
					</Switch>
				</BrowserRouter>
			</ApiContext.Provider>
		</RecoilRoot>
	);
};

export default Router;
