import { HttpGetClientSpy } from '@/data/test';
import { RemoteLoadSurveyList } from './remote-load-survey-list';
import { UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { type SurveyModel } from '@/domain/models';
import { mockSurveyListModel } from '@/domain/test';
import faker from 'faker';

type SutTypes = {
	sut: RemoteLoadSurveyList
	httpGetClientSpy: HttpGetClientSpy<SurveyModel[]>
};

const makeSut = (url = faker.internet.url()): SutTypes => {
	const httpGetClientSpy = new HttpGetClientSpy<SurveyModel[]>();
	const sut = new RemoteLoadSurveyList(url, httpGetClientSpy);
	return {
		sut,
		httpGetClientSpy
	};
};
describe('RemoteLoadSurveyList', () => {
	test('Should call HttpGetClient with correct URL', async () => {
		const url = faker.internet.url();
		const { sut, httpGetClientSpy } = makeSut(url);
		await sut.loadAll();
		expect(httpGetClientSpy.url).toBe(url);
	});

	test('Should throw EmailInUseError if HttpPostClient returns 403', async () => {
		const { sut, httpGetClientSpy } = makeSut();
		httpGetClientSpy.response = {
			statusCode: HttpStatusCode.forbidden
		};
		const promise = sut.loadAll();
		await expect(promise).rejects.toThrow(new UnexpectedError());
	});

	test('Should throw EmailInUseError if HttpPostClient returns 404', async () => {
		const { sut, httpGetClientSpy } = makeSut();
		httpGetClientSpy.response = {
			statusCode: HttpStatusCode.notFound
		};
		const promise = sut.loadAll();
		await expect(promise).rejects.toThrow(new UnexpectedError());
	});

	test('Should throw EmailInUseError if HttpPostClient returns 500', async () => {
		const { sut, httpGetClientSpy } = makeSut();
		httpGetClientSpy.response = {
			statusCode: HttpStatusCode.serverError
		};
		const promise = sut.loadAll();
		await expect(promise).rejects.toThrow(new UnexpectedError());
	});

	test('Should return a list of SurveyModels if HttpGetClient return 200', async () => {
		const { sut, httpGetClientSpy } = makeSut();
		const httpResult = mockSurveyListModel();
		httpGetClientSpy.response = {
			statusCode: HttpStatusCode.ok,
			body: httpResult
		};
		const surveyList = await sut.loadAll();
		expect(surveyList).toEqual(httpResult);
	});

	test('Should return an empty list if HttpGetClient return 204', async () => {
		const { sut, httpGetClientSpy } = makeSut();
		httpGetClientSpy.response = {
			statusCode: HttpStatusCode.noContent
		};
		const surveyList = await sut.loadAll();
		expect(surveyList).toEqual([]);
	});
});