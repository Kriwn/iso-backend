// src/domain/iso27001/iso27001-controls.validator.ts

import { controls_type } from "../../../generated/prisma/client";
import { ISO27001_CONTROL_BY_CODE } from "./iso27001-controls.catalog";

export class InvalidControlCodeError extends Error {
	constructor(public code: string) {
		super(`Invalid ISO control code: ${code}`);
		this.name = "InvalidControlCodeError";
	}
}

export class ControlTypeMismatchError extends Error {
	constructor(public code: string, public expected: controls_type, public actual: controls_type) {
		super(`Control ${code} type mismatch. expected=${expected}, actual=${actual}`);
		this.name = "ControlTypeMismatchError";
	}
}

const PREFIX_BY_TYPE: Record<controls_type, string> = {
	ORGANIZATION: "A.5.",
	PEOPLE: "A.6.",
	PHYSICAL: "A.7.",
	TECHNOLOGICAL: "A.8.",
};

export function normalizeControlCode(input: string, expectedPrefix: string) {
	const trimmed = input.trim();

	//A.6.1
	if (/^A\.\d+\.\d+$/.test(trimmed)) return trimmed;

	//6.1
	if (/^\d+\.\d+$/.test(trimmed)) return `A.${trimmed}`;

	//1
	if (/^\d+$/.test(trimmed)) return `${expectedPrefix}${trimmed}`;

	return `${expectedPrefix}${trimmed}`;
}


export function validateControlCodeForType(input: {
	code: string;
	assessmentType: controls_type;
}) {
	const { code, assessmentType } = input;

	const expectedPrefix = PREFIX_BY_TYPE[assessmentType];
	if (!code.startsWith(expectedPrefix)) {
		throw new ControlTypeMismatchError(code, assessmentType, assessmentType);
	}

	const catalogItem = ISO27001_CONTROL_BY_CODE.get(code);
	if (!catalogItem) {
		throw new InvalidControlCodeError(code);
	}

	if (catalogItem.type !== assessmentType) {
		throw new ControlTypeMismatchError(code, assessmentType, catalogItem.type);
	}

	return catalogItem;
}
