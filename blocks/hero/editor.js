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

    registerBlockType( 'ogig/hero', {
        apiVersion: 2,

        edit: function( props ) {
            const attributes    = props.attributes || {};
            const setAttributes = props.setAttributes;

            const eyebrow              = attributes.eyebrow || '';
            const heading              = attributes.heading || '';
            const body                 = attributes.body || '';
            const primaryButtonLabel   = attributes.primaryButtonLabel || '';
            const primaryButtonUrl     = attributes.primaryButtonUrl || '';
            const secondaryButtonLabel = attributes.secondaryButtonLabel || '';
            const secondaryButtonUrl   = attributes.secondaryButtonUrl || '';
            const stat1Value           = attributes.stat1Value || '';
            const stat1Label           = attributes.stat1Label || '';
            const stat2Value           = attributes.stat2Value || '';
            const stat2Label           = attributes.stat2Label || '';
            const stat3Value           = attributes.stat3Value || '';
            const stat3Label           = attributes.stat3Label || '';
            const imageId              = attributes.imageId || 0;

            function onSelectImage( media ) {
                if ( ! media || ! media.id ) {
                    setAttributes( { imageId: 0 } );
                    return;
                }
                setAttributes( { imageId: media.id } );
            }

            const blockProps = useBlockProps( {
                className: 'heroblock',
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
                        label: __( 'Eyebrow', 'ogig' ),
                        value: eyebrow,
                        onChange: function( value ) {
                            setAttributes( { eyebrow: value } );
                        },
                    } ),
                    createElement( TextControl, {
                        label: __( 'Body text', 'ogig' ),
                        value: body,
                        onChange: function( value ) {
                            setAttributes( { body: value } );
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

                // Stats
                createElement(
                    PanelBody,
                    { title: __( 'Stats', 'ogig' ), initialOpen: false },
                    createElement( TextControl, {
                        label: __( 'Stat 1 value', 'ogig' ),
                        value: stat1Value,
                        onChange: function( value ) {
                            setAttributes( { stat1Value: value } );
                        },
                    } ),
                    createElement( TextControl, {
                        label: __( 'Stat 1 label', 'ogig' ),
                        value: stat1Label,
                        onChange: function( value ) {
                            setAttributes( { stat1Label: value } );
                        },
                    } ),

                    createElement( TextControl, {
                        label: __( 'Stat 2 value', 'ogig' ),
                        value: stat2Value,
                        onChange: function( value ) {
                            setAttributes( { stat2Value: value } );
                        },
                    } ),
                    createElement( TextControl, {
                        label: __( 'Stat 2 label', 'ogig' ),
                        value: stat2Label,
                        onChange: function( value ) {
                            setAttributes( { stat2Label: value } );
                        },
                    } ),

                    createElement( TextControl, {
                        label: __( 'Stat 3 value', 'ogig' ),
                        value: stat3Value,
                        onChange: function( value ) {
                            setAttributes( { stat3Value: value } );
                        },
                    } ),
                    createElement( TextControl, {
                        label: __( 'Stat 3 label', 'ogig' ),
                        value: stat3Label,
                        onChange: function( value ) {
                            setAttributes( { stat3Label: value } );
                        },
                    } )
                ),

                // Image
                createElement(
                    PanelBody,
                    { title: __( 'Hero Image', 'ogig' ), initialOpen: false },
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
            const stats = createElement(
                'div',
                { className: 'heroblock__stats' },
                ( stat1Value && stat1Label ) &&
                    createElement(
                        'div',
                        { className: 'heroblock__stat' },
                        createElement(
                            'div',
                            { className: 'heroblock__stat-value' },
                            stat1Value
                        ),
                        createElement(
                            'div',
                            { className: 'heroblock__stat-label' },
                            stat1Label
                        )
                    ),
                ( stat2Value && stat2Label ) &&
                    createElement(
                        'div',
                        { className: 'heroblock__stat' },
                        createElement(
                            'div',
                            { className: 'heroblock__stat-value' },
                            stat2Value
                        ),
                        createElement(
                            'div',
                            { className: 'heroblock__stat-label' },
                            stat2Label
                        )
                    ),
                ( stat3Value && stat3Label ) &&
                    createElement(
                        'div',
                        { className: 'heroblock__stat' },
                        createElement(
                            'div',
                            { className: 'heroblock__stat-value' },
                            stat3Value
                        ),
                        createElement(
                            'div',
                            { className: 'heroblock__stat-label' },
                            stat3Label
                        )
                    )
            );

            const contentColumn = createElement(
                'div',
                { className: 'heroblock__content' },
                eyebrow &&
                    createElement(
                        'p',
                        { className: 'heroblock__eyebrow' },
                        eyebrow
                    ),
                createElement( RichText, {
                    tagName: 'h1',
                    className: 'heroblock__title',
                    value: heading,
                    placeholder: __( 'Add heading…', 'ogig' ),
                    onChange: function( value ) {
                        setAttributes( { heading: value } );
                    },
                } ),
                createElement( RichText, {
                    tagName: 'p',
                    className: 'heroblock__body',
                    value: body,
                    placeholder: __( 'Add description…', 'ogig' ),
                    onChange: function( value ) {
                        setAttributes( { body: value } );
                    },
                } ),
                createElement(
                    'div',
                    { className: 'heroblock__cta-row' },
                    primaryButtonLabel &&
                        createElement(
                            'span',
                            {
                                className:
                                    'heroblock__button heroblock__button--primary',
                            },
                            primaryButtonLabel
                        ),
                    secondaryButtonLabel &&
                        createElement(
                            'span',
                            {
                                className:
                                    'heroblock__button heroblock__button--ghost',
                            },
                            secondaryButtonLabel
                        )
                ),
                stats
            );

            const imageColumn = createElement(
                'div',
                { className: 'heroblock__image' },
                createElement(
                    'div',
                    { className: 'heroblock__image-card' },
                    createElement(
                        'div',
                        { className: 'heroblock__image-placeholder' },
                        imageId
                            ? __(
                                  'Image selected (view on front-end)',
                                  'ogig'
                              )
                            : __(
                                  'Select a hero image in the sidebar.',
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
                    { className: 'heroblock__inner' },
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