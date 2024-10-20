import { parseBoolean, tryHideLabel } from '../../utils/index.js';
import { customElement, html, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { ManifestBase } from '@umbraco-cms/backoffice/extension-api';

const ELEMENT_NAME = 'contentment-property-editor-ui-templated-label';

@customElement(ELEMENT_NAME)
export class ContentmentPropertyEditorUITemplatedLabelElement
	extends UmbLitElement
	implements UmbPropertyEditorUiElement
{
	#components?: Array<string>;

	#hideLabel: boolean = false;

	@property({ attribute: false })
	public value?: unknown;

	set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;
		this.#components = config.getValueByAlias('component') ?? [];
		this.#hideLabel = parseBoolean(config.getValueByAlias('hideLabel'));
	}

	override connectedCallback() {
		super.connectedCallback();
		tryHideLabel(this, this.#hideLabel);
	}

	override render() {
		if (!this.#components?.length) return html`<p>A templated label component has not been configured.</p>`;
		return html`
			<umb-extension-slot
				type="contentmentTemplatedLabel"
				.filter=${(manifest: ManifestBase) => this.#components?.includes(manifest.alias)}
				.props=${{ value: this.value }}>
			</umb-extension-slot>
		`;
	}
}

export { ContentmentPropertyEditorUITemplatedLabelElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[ELEMENT_NAME]: ContentmentPropertyEditorUITemplatedLabelElement;
	}
}
