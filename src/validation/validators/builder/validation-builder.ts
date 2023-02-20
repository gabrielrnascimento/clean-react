import { type FieldValidation } from '@/validation/protocols/field-validation';
import { EmailValidation, MinLengthValidation, RequiredFieldValidation } from '@/validation/validators';
import { CompareFieldsValidation } from '../compare-fields/compare-fields-validation';

export class ValidationBuilder {
	private constructor (
		private readonly fiedlName: string,
		private readonly validations: FieldValidation[]
	) {}

	static field (fieldName: string): ValidationBuilder {
		return new ValidationBuilder(fieldName, []);
	}

	required (): ValidationBuilder {
		this.validations.push(new RequiredFieldValidation(this.fiedlName));
		return this;
	}

	email (): ValidationBuilder {
		this.validations.push(new EmailValidation(this.fiedlName));
		return this;
	}

	min (length: number): ValidationBuilder {
		this.validations.push(new MinLengthValidation(this.fiedlName, length));
		return this;
	}

	sameAs (fieldToCompare: string): ValidationBuilder {
		this.validations.push(new CompareFieldsValidation(this.fiedlName, fieldToCompare));
		return this;
	}

	build (): FieldValidation[] {
		return this.validations;
	}
}
