import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { makeLogin } from '@/main/factories/pages/login/login-factory';
import { makeSignUp } from '@/main/factories/pages/signup/signup-factory';
import { ApiContext } from '@/presentation/contexts';
import { SurveyList } from '@/presentation/pages';
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '../adapters/current-account-adapter';
import { PrivateRouter } from '@/presentation/components';

const Router: React.FC = () => {
	return (
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
					<PrivateRouter path='/' exact component={SurveyList} />
				</Switch>
			</BrowserRouter>
		</ApiContext.Provider>
	);
};

export default Router;