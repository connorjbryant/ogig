(function( wp ) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const {
        InspectorControls,
        RichText,
        MediaUpload,
        MediaUploadCheck,
        URLInput,
        useBlockProps,
    } = wp.blockEditor || wp.editor;
    const { PanelBody, TextControl, Button } = wp.components;
    const { Fragment, createElement } = wp.element;

    registerBlockType( 'ogig/about', {
        apiVersion: 2,

        edit: function( props ) {
            const attributes    = props.attributes || {};
            const setAttributes = props.setAttributes;

            const kicker               = attributes.kicker || '';
            const heading              = attributes.heading || '';
            const subtitle             = attributes.subtitle || '';
            const body                 = attributes.body || '';
            const bgStamp              = attributes.bgStamp || '';
            const primaryButtonLabel   = attributes.primaryButtonLabel || '';
            const primaryButtonUrl     = attributes.primaryButtonUrl || '';
            const secondaryButtonLabel = attributes.secondaryButtonLabel || '';
            const secondaryButtonUrl   = attributes.secondaryButtonUrl || '';
            const highlight1Value      = attributes.highlight1Value || '';
            const highlight1Label      = attributes.highlight1Label || '';
            const highlight2Value      = attributes.highlight2Value || '';
            const highlight2Label      = attributes.highlight2Label || '';
            const highlight3Value      = attributes.highlight3Value || '';
            const highlight3Label      = attributes.highlight3Label || '';
            const imageId              = attributes.imageId || 0;

            function onSelectImage( media ) {
                if ( ! media || ! media.id ) {
                    setAttributes( { imageId: 0 } );
                    return;
                }
                setAttributes( { imageId: media.id } );
            }

            const blockProps = useBlockProps( {
                className: 'aboutblock',
            } );

            // ===== Inspector controls =====
            const inspector = createElement(
                InspectorControls,
                null,
                // Content
                createElement(
                    PanelBody,
                    { title: __( 'Content', 'ogig' ), initialOpen: true },
                    createElement( TextControl, {
                        label: __( 'Kicker', 'ogig' ),
                        help: __( 'Small label above the headline (e.g. About Us).', 'ogig' ),
                        value: kicker,
                        onChange: function( value ) {
                            setAttributes( { kicker: value } );
                        },
                    } ),
                    createElement( TextControl, {
                        label: __( 'Subtitle', 'ogig' ),
                        help: __( 'Short supporting line under the headline.', 'ogig' ),
                        value: subtitle,
                        onChange: function( value ) {
                            setAttributes( { subtitle: value } );
                        },
                    } ),
                    createElement( TextControl, {
                        label: __( 'Background stamp', 'ogig' ),
                        help: __( 'Optional big background text (e.g. EST. 19XX). Leave blank to hide.', 'ogig' ),
                        value: bgStamp,
                        onChange: function( value ) {
                            setAttributes( { bgStamp: value } );
                        },
                    } )
                ),

                // Primary button
                createElement(
                    PanelBody,
                    { title: __( 'Primary Button', 'ogig' ), initialOpen: true },
                    createElement( TextControl, {
                        label: __( 'Label', 'ogig' ),
                        value: primaryButtonLabel,
                        onChange: function( value ) {
                            setAttributes( { primaryButtonLabel: value } );
                        },
                    } ),
                    createElement( URLInput, {
                        label: __( 'URL', 'ogig' ),
                        value: primaryButtonUrl,
                        onChange: function( url ) {
                            setAttributes( { primaryButtonUrl: url } );
                        },
                    } )
                ),

                // Secondary button
                createElement(
                    PanelBody,
                    { title: __( 'Secondary Button', 'ogig' ), initialOpen: false },
                    createElement( TextControl, {
                        label: __( 'Label', 'ogig' ),
                        value: secondaryButtonLabel,
                        onChange: function( value ) {
                            setAttributes( { secondaryButtonLabel: value } );
                        },
                    } ),
                    createElement( URLInput, {
                        label: __( 'URL', 'ogig' ),
                        value: secondaryButtonUrl,
                        onChange: function( url ) {
                            setAttributes( { secondaryButtonUrl: url } );
                        },
                    } )
                ),

                // Highlights
                createElement(
                    PanelBody,
                    { title: __( 'Highlights', 'ogig' ), initialOpen: false },
                    createElement( TextControl, {
                        label: __( 'Highlight 1 value', 'ogig' ),
                        value: highlight1Value,
                        onChange: function( value ) {
                            setAttributes( { highlight1Value: value } );
                        },
                    } ),
                    createElement( TextControl, {
                        label: __( 'Highlight 1 label', 'ogig' ),
                        value: highlight1Label,
                        onChange: function( value ) {
                            setAttributes( { highlight1Label: value } );
                        },
                    } ),

                    createElement( TextControl, {
                        label: __( 'Highlight 2 value', 'ogig' ),
                        value: highlight2Value,
                        onChange: function( value ) {
                            setAttributes( { highlight2Value: value } );
                        },
                    } ),
                    createElement( TextControl, {
                        label: __( 'Highlight 2 label', 'ogig' ),
                        value: highlight2Label,
                        onChange: function( value ) {
                            setAttributes( { highlight2Label: value } );
                        },
                    } ),

                    createElement( TextControl, {
                        label: __( 'Highlight 3 value', 'ogig' ),
                        value: highlight3Value,
                        onChange: function( value ) {
                            setAttributes( { highlight3Value: value } );
                        },
                    } ),
                    createElement( TextControl, {
                        label: __( 'Highlight 3 label', 'ogig' ),
                        value: highlight3Label,
                        onChange: function( value ) {
                            setAttributes( { highlight3Label: value } );
                        },
                    } )
                ),

                // Image
                createElement(
                    PanelBody,
                    { title: __( 'About Image', 'ogig' ), initialOpen: false },
                    createElement(
                        MediaUploadCheck,
                        null,
                        createElement( MediaUpload, {
                            onSelect: onSelectImage,
                            allowedTypes: [ 'image' ],
                            value: imageId,
                            render: function( obj ) {
                                return createElement(
                                    Button,
                                    {
                                        variant: 'secondary',
                                        onClick: obj.open,
                                    },
                                    imageId
                                        ? __( 'Replace image', 'ogig' )
                                        : __( 'Select image', 'ogig' )
                                );
                            },
                        } )
                    )
                )
            );

            // ===== Block preview in editor =====
            const highlights = createElement(
                'div',
                { className: 'aboutblock__highlights' },
                ( highlight1Value && highlight1Label ) &&
                    createElement(
                        'div',
                        { className: 'aboutblock__highlight' },
                        createElement(
                            'div',
                            { className: 'aboutblock__highlight-value' },
                            highlight1Value
                        ),
                        createElement(
                            'div',
                            { className: 'aboutblock__highlight-label' },
                            highlight1Label
                        )
                    ),
                ( highlight2Value && highlight2Label ) &&
                    createElement(
                        'div',
                        { className: 'aboutblock__highlight' },
                        createElement(
                            'div',
                            { className: 'aboutblock__highlight-value' },
                            highlight2Value
                        ),
                        createElement(
                            'div',
                            { className: 'aboutblock__highlight-label' },
                            highlight2Label
                        )
                    ),
                ( highlight3Value && highlight3Label ) &&
                    createElement(
                        'div',
                        { className: 'aboutblock__highlight' },
                        createElement(
                            'div',
                            { className: 'aboutblock__highlight-value' },
                            highlight3Value
                        ),
                        createElement(
                            'div',
                            { className: 'aboutblock__highlight-label' },
                            highlight3Label
                        )
                    )
            );

            const contentColumn = createElement(
                'div',
                { className: 'aboutblock__content' },
                bgStamp &&
                    createElement(
                        'p',
                        { className: 'aboutblock__stamp', 'aria-hidden': 'true' },
                        bgStamp
                    ),
                kicker &&
                    createElement(
                        'p',
                        { className: 'aboutblock__kicker' },
                        kicker
                    ),
                createElement( RichText, {
                    tagName: 'h2',
                    className: 'aboutblock__title',
                    value: heading,
                    placeholder: __( 'Add headline…', 'ogig' ),
                    onChange: function( value ) {
                        setAttributes( { heading: value } );
                    },
                } ),
                subtitle &&
                    createElement(
                        'p',
                        { className: 'aboutblock__subtitle' },
                        subtitle
                    ),
                createElement( RichText, {
                    tagName: 'div',
                    className: 'aboutblock__body',
                    value: body,
                    placeholder: __( 'Add your about copy…', 'ogig' ),
                    onChange: function( value ) {
                        setAttributes( { body: value } );
                    },
                } ),
                createElement(
                    'div',
                    { className: 'aboutblock__cta-row' },
                    primaryButtonLabel &&
                        createElement(
                            'span',
                            {
                                className:
                                    'aboutblock__button aboutblock__button--primary',
                            },
                            primaryButtonLabel
                        ),
                    secondaryButtonLabel &&
                        createElement(
                            'span',
                            {
                                className:
                                    'aboutblock__button aboutblock__button--ghost',
                            },
                            secondaryButtonLabel
                        )
                ),
                highlights
            );

            const imageColumn = createElement(
                'div',
                { className: 'aboutblock__image' },
                createElement(
                    'div',
                    { className: 'aboutblock__image-card' },
                    createElement(
                        'div',
                        { className: 'aboutblock__image-placeholder' },
                        imageId
                            ? __(
                                  'Image selected (view on front-end)',
                                  'ogig'
                              )
                            : __(
                                  'Select an about image in the sidebar.',
                                  'ogig'
                              )
                    )
                )
            );

            const section = createElement(
                'section',
                blockProps,
                createElement(
                    'div',
                    { className: 'aboutblock__inner' },
                    contentColumn,
                    imageColumn
                )
            );

            return createElement(
                Fragment,
                null,
                inspector,
                section
            );
        },

        save: function() {
            return null; // server-rendered
        },
    } );
})( window.wp );