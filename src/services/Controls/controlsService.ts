import { AssessmentControlNotFoundError } from "../../errors/assessmentControlError";
import { AssessmentControlRepository } from "../../repositories/assessmentControlRepository";
import { ControlsRepository } from "../../repositories/controlsRepository";
import { SuggestionRepository } from "../../repositories/suggestionRepository";
import { LlmService, LLMServiceError } from "../llm/llmService";
import { CreateSuggestionDto } from "../suggestion/suggestionDto";
import { CreateControlDto, UpdateControlDto } from "./controlsDto";
import { normalizeControlCode, validateControlCodeForType } from "./iso27001-controls.validator";

const prefixMap = {
	ORGANIZATION: "A.5.",
	PEOPLE: "A.6.",
	PHYSICAL: "A.7.",
	TECHNOLOGICAL: "A.8.",
} as const;

export class ControlsService {
	constructor(
		private assessmentControlsRepository: AssessmentControlRepository,
		private controlsRepository: ControlsRepository,
		private suggestionRepository: SuggestionRepository,
		private llmService: LlmService
	) { }

	async createControl(data: CreateControlDto) {
		const assessmentControl = await this.assessmentControlsRepository.getById(data.assessmentControlId);
		if (!assessmentControl) {
			throw new AssessmentControlNotFoundError(data.assessmentControlId);
		}
		const expectedPrefix = prefixMap[assessmentControl.type];
		const realCode = normalizeControlCode(data.code, expectedPrefix);
		const item = validateControlCodeForType({
			code: realCode,
			assessmentType: assessmentControl.type,
		});
		data.code = item.code;
		data.name = item.name;
		data.guidance = item.guidance;
		data.description = item.description;
		return this.controlsRepository.create(data);
	}

	async suggestControl(id: number) {
		const Control = await this.controlsRepository.getById(id);
		if (!Control) {
			throw new AssessmentControlNotFoundError(id);
		}
		const payload = {
			"controlCode": Control.code,
			"title": Control.name,
			"description": Control.description,
			"guidance": Control.guidance,
			"status": Control.status,
			"currentPractice": Control.currentPractice,
			"userContext": Control.userContext,
			"evidenceDescription": Control.evidenceDescription,
		};
		const res = await this.llmService.suggestWithLlm(payload);

		if (!res.ok) {
			throw new LLMServiceError(id);
		}

		let suggest = await this.suggestionRepository.getByControlId(id);
		if (!suggest) {
			suggest = await this.suggestionRepository.create({
				controlId: id,
				content: res.aiSuggestion,
			});
			suggest = await this.suggestionRepository.update(suggest.id, {
				content: res.aiSuggestion,
			});
		}
		return suggest;
	}

	async getControlByCodeIso(code: string, assessmentControlId: number) {
		return this.controlsRepository.getByCodeIso(code, assessmentControlId);
	}

	async getControlById(id: number) {
		return this.controlsRepository.getById(id);
	}

	async getAllControls() {
		return this.controlsRepository.getAll();
	}

	async updateControl(id: number, data: UpdateControlDto) {
		return this.controlsRepository.update(id, data);
	}

	async deleteControl(id: number) {
		return this.controlsRepository.delete(id);
	}
}
