/* Copyright © 2019 Lee Kelleher.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Strings;

namespace Umbraco.Community.Contentment.DataEditors
{
    public sealed class DataListDataEditor : IDataEditor
    {
        internal const string DataEditorAlias = Constants.Internals.DataEditorAliasPrefix + "DataList";
        internal const string DataEditorName = Constants.Internals.DataEditorNamePrefix + "Data List";
        internal const string DataEditorViewPath = Constants.Internals.EmptyEditorViewPath;
        internal const string DataEditorPreviewViewPath = Constants.Internals.EditorsPathRoot + "data-list.preview.html";
        internal const string DataEditorDataSourcePreviewViewPath = Constants.Internals.EditorsPathRoot + "data-source.preview.html";
        internal const string DataEditorIcon = "icon-fa-list-ul";
        internal const string DataEditorUiAlias = Constants.Internals.DataEditorUiAliasPrefix + "DataList";

        private readonly ConfigurationEditorUtility _utility;
        private readonly IShortStringHelper _shortStringHelper;
        private readonly IJsonSerializer _jsonSerializer;

        public DataListDataEditor(
            IJsonSerializer jsonSerializer,
            IShortStringHelper shortStringHelper,
            ConfigurationEditorUtility utility)
        {
            _shortStringHelper = shortStringHelper;
            _jsonSerializer = jsonSerializer;
            _utility = utility;
        }

        public string Alias => DataEditorAlias;

        public string Name => DataEditorName;

        public string Icon => DataEditorIcon;

        public string Group => UmbConstants.PropertyEditors.Groups.Lists;

        public bool IsDeprecated => false;

        public IDictionary<string, object> DefaultConfiguration => new Dictionary<string, object>();

        public IPropertyIndexValueFactory PropertyIndexValueFactory => new DefaultPropertyIndexValueFactory();

        public IConfigurationEditor GetConfigurationEditor() => new DataListConfigurationEditor(_utility);

        public IDataValueEditor GetValueEditor()
        {
            return new DataListDataValueEditor(_shortStringHelper, _jsonSerializer)
            {
                ValueType = ValueTypes.Json,
                //View = _ioHelper.ResolveRelativeOrVirtualUrl(DataEditorViewPath),
            };
        }

        public IDataValueEditor GetValueEditor(object? configuration)
        {
            //var view = default(string);

            //if (configuration is Dictionary<string, object> config &&
            //    config.TryGetValueAs(DataListConfigurationEditor.ListEditor, out JArray? array) == true &&
            //    array?.Count > 0 &&
            //    array[0] is JObject item &&
            //    item.Value<string>("key") is string key)
            //{
            //    var editor = _utility.GetConfigurationEditor<IDataListEditor>(key);
            //    if (editor != null)
            //    {
            //        view = editor.View;
            //    }
            //}

            return new DataListDataValueEditor(_shortStringHelper, _jsonSerializer)
            {
                ConfigurationObject = configuration,
                ValueType = ValueTypes.Json,
                //View = _ioHelper.ResolveRelativeOrVirtualUrl(view ?? DataEditorViewPath),
            };
        }
    }
}
