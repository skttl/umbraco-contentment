import {
	classMap,
	css,
	customElement,
	html,
	ifDefined,
	property,
	repeat,
	state,
	when,
} from '@umbraco-cms/backoffice/external/lit';
import { parseBoolean } from '../../utils/parse-boolean.function.js';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';
import type { ContentmentDataListItem } from '../types.js';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';

type ContentmentDataListButtonOption = ContentmentDataListItem & { selected: boolean };

@customElement('contentment-property-editor-ui-buttons')
export default class ContentmentPropertyEditorUIButtonsElement
	extends UmbLitElement
	implements UmbPropertyEditorUiElement
{
	@property({ type: Array })
	public set value(value: Array<string> | string | undefined) {
		this.#value = Array.isArray(value) ? value : value ? [value] : [];
	}
	public get value(): Array<string> | undefined {
		return this.#value;
	}
	#value?: Array<string> = [];

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;
		// const allowClear = parseBoolean(config.getValueByAlias('allowClear'));
		// const defaultIcon = config.getValueByAlias('defaultIcon') ?? '';
		// const defaultValue = config.getValueByAlias('defaultValue') ?? [];
		this._enableMultiple = parseBoolean(config.getValueByAlias('enableMultiple'));
		this._labelStyle = config.getValueByAlias('labelStyle') ?? 'both';
		this._size = config.getValueByAlias('size') ?? 'm';

		const items = config.getValueByAlias<Array<ContentmentDataListItem>>('items') ?? [];
		this._items = items.map((item) => ({ ...item, selected: this.value?.includes(item.value) ?? false }));
	}

	@state()
	private _enableMultiple = false;

	@state()
	private _items: Array<ContentmentDataListButtonOption> = [];

	@state()
	private _labelStyle: 'icon' | 'text' | 'both' = 'both';

	@state()
	private _size: 's' | 'm' | 'l' = 'm';

	#onClick(item: ContentmentDataListButtonOption) {
		item.selected = !item.selected;

		const values: Array<string> = [];

		this._items.forEach((item) => {
			if (!this._enableMultiple) {
				item.selected = item.value === item.value;
			}

			if (item.selected) {
				values?.push(item.value);
			}
		});

		this.value = values;

		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	render() {
		return html`
			<uui-button-group>
				${repeat(
					this._items,
					(item) => item.value,
					(item) => this.#renderItem(item)
				)}
			</uui-button-group>
		`;
	}

	#renderItem(item: ContentmentDataListButtonOption) {
		const classes = {
			active: item.selected,
			small: this._size === 's',
			medium: this._size === 'm',
			large: this._size === 'l',
		};
		const title = this._labelStyle === 'icon' ? [item.name, item.description].join(', ') : item.description;
		return html`
			<uui-button
				class=${classMap(classes)}
				look="secondary"
				title=${ifDefined(title)}
				@click=${() => this.#onClick(item)}>
				<div>
					${when(this._labelStyle !== 'text', () => this.#renderIcon(item))}
					${when(this._labelStyle !== 'icon', () => html`<span>${item.name}</span>`)}
				</div>
			</uui-button>
		`;
	}

	#renderIcon(item: ContentmentDataListItem) {
		const [icon, color] = item.icon?.split(' ') ?? [];
		return html`<umb-icon name=${ifDefined(icon)} color=${ifDefined(color)}></umb-icon>`;
	}

	static styles = [
		css`
			uui-button.small {
				font-size: 0.8rem;
			}
			uui-button.medium {
				font-size: 1rem;
			}
			uui-button.large {
				font-size: 1.2rem;
			}
			uui-button.active {
				--uui-button-background-color: var(--uui-menu-item-background-color-active, var(--uui-color-current, #f5c1bc));
			}
			uui-button.active:hover {
				--uui-button-background-color-hover: var(
					--uui-menu-item-background-color-active-hover,
					var(--uui-color-current-emphasis, #f8d6d3)
				);
			}
			uui-button > div {
				display: flex;
				gap: 0.3rem;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'contentment-property-editor-ui-buttons': ContentmentPropertyEditorUIButtonsElement;
	}
}
