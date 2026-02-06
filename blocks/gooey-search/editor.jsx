/* global wp */
(function () {
  const { createElement: h } = wp.element;
  const { registerBlockType } = wp.blocks;
  const { useBlockProps, InspectorControls } = wp.blockEditor;
  const { PanelBody, TextControl } = wp.components;

  registerBlockType('ogig/gooey-search', {
    edit({ attributes, setAttributes }) {
      const bp = useBlockProps({ className: 'gooey-search-block' });
      return h('div', bp,
        h(InspectorControls, null,
          h(PanelBody, { title: 'Settings', initialOpen: true },
            h(TextControl, {
              label: 'Placeholder',
              value: attributes.placeholder || 'Search…',
              onChange: (v) => setAttributes({ placeholder: v })
            })
          )
        ),
        h('div', { className: 'gooey-search__editor-skeleton' },
          h('div', { className: 'gooey-search__pill' }),
          h('div', { style: { marginTop: 8, opacity: .6 } },
            'Gooey Search (frontend animation)')
        )
      );
    },
    save() { return null; }
  });
})();
