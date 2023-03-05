import { Icon, IconName } from '@/presentation/components';
import Styles from './survey-item-styles.scss';
import React from 'react';
import { type SurveyModel } from '@/domain/models';

type Props = {
	survey: SurveyModel
};

const SurveyItem: React.FC<Props> = ({ survey }: Props) => {
	return (
		<li className={Styles.surveyItemWrap}>
			<div className={Styles.surveyContent}>
				<Icon className={Styles.iconWrap} iconName={IconName.thumbUp} />
				<time>
					<span data-testid="day" className={Styles.day}>
						{survey.date.getDate()}
					</span>
					<span data-testid="month" className={Styles.month}>
						{survey.date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
					</span>
					<span data-testid="year" className={Styles.year}>
						{survey.date.getFullYear()}
					</span>
				</time>
				<p data-testid="question">{survey.question}</p>
			</div>
			<footer>Ver Resultado</footer>
		</li>
	);
};

export default SurveyItem;
