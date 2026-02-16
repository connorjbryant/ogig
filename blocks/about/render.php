<?php
/**
 * Server-rendered About block – Refined Industrial Style (Semantic + SEO Friendly)
 * - Full-bleed background
 * - Content + Image layout
 * - Trust/Highlights as semantic aside + definition list
 * - Heading level controlled by headingLevel attribute (block.json + editor.js)
 *
 * Recommended usage:
 * - If your template already outputs the page title as H1, set this block to H2 in the inspector.
 * - If this block is the ONLY primary heading on the page (rare in WP templates), set to H1.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ---------------------------
// Content fields
// ---------------------------
$kicker   = isset( $attributes['kicker'] ) ? trim( (string) $attributes['kicker'] ) : '';
$heading  = isset( $attributes['heading'] ) ? trim( (string) $attributes['heading'] ) : '';
$subtitle = isset( $attributes['subtitle'] ) ? trim( (string) $attributes['subtitle'] ) : '';
$body     = isset( $attributes['body'] ) ? (string) $attributes['body'] : '';

// ---------------------------
// Watermark
// ---------------------------
$bg_stamp            = isset( $attributes['bgStamp'] ) ? trim( (string) $attributes['bgStamp'] ) : 'OG';
$disable_text_wm     = ! empty( $attributes['disableWatermarkText'] ); // optional if you add later
$watermark_image_id  = isset( $attributes['watermarkImageId'] ) ? absint( $attributes['watermarkImageId'] ) : 0;
$watermark_opacity   = isset( $attributes['watermarkImageOpacity'] ) ? (float) $attributes['watermarkImageOpacity'] : 0.10;

// ---------------------------
// Heading level (MATCH block.json + editor.js)
// ---------------------------
// block.json defines headingLevel (number) with default 1 in your file.
// If you want safer SEO defaults site-wide, set block.json default to 2.
// For now we support:
// - explicit headingLevel: 1..6
// - fallback: 2 (safer if attribute missing on older blocks)
$level = 2;
if ( isset( $attributes['headingLevel'] ) ) {
	$level = (int) $attributes['headingLevel'];
}
if ( $level < 1 || $level > 6 ) {
	$level = 2;
}

$heading_tag = 'h' . $level;

// Trust heading should be one deeper than main heading: H1->H2, H2->H3, etc.
$trust_level = min( 6, $level + 1 );
$trust_tag   = 'h' . $trust_level;

// ---------------------------
// Buttons (only render if URL exists)
// ---------------------------
$primary_label   = isset( $attributes['primaryButtonLabel'] ) ? trim( (string) $attributes['primaryButtonLabel'] ) : '';
$primary_url_raw = isset( $attributes['primaryButtonUrl'] ) ? (string) $attributes['primaryButtonUrl'] : '';
$primary_url     = $primary_url_raw ? esc_url( $primary_url_raw ) : '';

$secondary_label   = isset( $attributes['secondaryButtonLabel'] ) ? trim( (string) $attributes['secondaryButtonLabel'] ) : '';
$secondary_url_raw = isset( $attributes['secondaryButtonUrl'] ) ? (string) $attributes['secondaryButtonUrl'] : '';
$secondary_url     = $secondary_url_raw ? esc_url( $secondary_url_raw ) : '';

// ---------------------------
// Highlights / Trust
// ---------------------------
$h1_value = isset( $attributes['highlight1Value'] ) ? trim( (string) $attributes['highlight1Value'] ) : '';
$h1_label = isset( $attributes['highlight1Label'] ) ? trim( (string) $attributes['highlight1Label'] ) : '';

$h2_value = isset( $attributes['highlight2Value'] ) ? trim( (string) $attributes['highlight2Value'] ) : '';
$h2_label = isset( $attributes['highlight2Label'] ) ? trim( (string) $attributes['highlight2Label'] ) : '';

$h3_value = isset( $attributes['highlight3Value'] ) ? trim( (string) $attributes['highlight3Value'] ) : '';
$h3_label = isset( $attributes['highlight3Label'] ) ? trim( (string) $attributes['highlight3Label'] ) : '';

$highlights_heading = isset( $attributes['highlightsHeading'] ) ? trim( (string) $attributes['highlightsHeading'] ) : __( 'Why Choose OGIG', 'ogig' );
$highlights_intro   = isset( $attributes['highlightsIntro'] ) ? trim( (string) $attributes['highlightsIntro'] ) : '';

// ---------------------------
// Image
// ---------------------------
$image_id = isset( $attributes['imageId'] ) ? absint( $attributes['imageId'] ) : 0;

$image_html = '';
if ( $image_id ) {
	$image_html = wp_get_attachment_image(
		$image_id,
		'large',
		false,
		[
			'class'    => 'aboutblock__image-media',
			'loading'  => 'lazy',
			'decoding' => 'async',
		]
	);
}

// ---------------------------
// Watermark image HTML
// ---------------------------
$watermark_image_html = '';
if ( $watermark_image_id ) {
	$watermark_image_html = wp_get_attachment_image(
		$watermark_image_id,
		'large',
		false,
		[
			'class'    => 'aboutblock__watermark-img',
			'loading'  => 'lazy',
			'decoding' => 'async',
		]
	);
}

// ---------------------------
// Fallbacks
// ---------------------------
if ( $heading === '' ) { $heading = __( 'Precision Manufacturing Built to Last', 'ogig' ); }
if ( $kicker === '' )  { $kicker  = __( 'About Us', 'ogig' ); }

$body_safe = wp_kses_post( $body );

// watermark text safe
$watermark_text = $bg_stamp !== '' ? $bg_stamp : 'OG';
$watermark_safe = nl2br( wp_kses( $watermark_text, [ 'br' => [] ] ), false );

// ids for aria
$title_id       = 'aboutblock-title-' . wp_unique_id();
$trust_title_id = 'aboutblock-trust-title-' . wp_unique_id();

// trust existence
$has_h1    = ( $h1_value !== '' && $h1_label !== '' );
$has_h2    = ( $h2_value !== '' && $h2_label !== '' );
$has_h3    = ( $h3_value !== '' && $h3_label !== '' );
$has_trust = ( $has_h1 || $has_h2 || $has_h3 );
?>

<section class="aboutblock aboutblock--light alignfull" aria-labelledby="<?php echo esc_attr( $title_id ); ?>">
	<div class="aboutblock__inner alignwide" data-aos="fade-up">

		<?php if ( ! $disable_text_wm ) : ?>
			<div class="aboutblock__watermark" aria-hidden="true" style="opacity: <?php echo esc_attr( $watermark_opacity ); ?>;">
				<?php if ( $watermark_image_html ) : ?>
					<?php echo $watermark_image_html; ?>
				<?php else : ?>
					<div class="aboutblock__watermark-text"><?php echo $watermark_safe; ?></div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<article class="aboutblock__content">
			<?php if ( $kicker !== '' ) : ?>
				<p class="aboutblock__kicker"><?php echo esc_html( $kicker ); ?></p>
			<?php endif; ?>

			<<?php echo tag_escape( $heading_tag ); ?> id="<?php echo esc_attr( $title_id ); ?>" class="aboutblock__title">
				<?php echo esc_html( $heading ); ?>
			</<?php echo tag_escape( $heading_tag ); ?>>

			<?php if ( $subtitle !== '' ) : ?>
				<p class="aboutblock__subtitle"><?php echo esc_html( $subtitle ); ?></p>
			<?php endif; ?>

			<?php if ( trim( wp_strip_all_tags( $body_safe ) ) !== '' ) : ?>
				<div class="aboutblock__body"><?php echo $body_safe; ?></div>
			<?php endif; ?>

			<?php if ( ( $primary_label && $primary_url ) || ( $secondary_label && $secondary_url ) ) : ?>
				<nav class="aboutblock__cta-row" aria-label="<?php echo esc_attr__( 'About section links', 'ogig' ); ?>">
					<?php if ( $primary_label && $primary_url ) : ?>
						<a class="aboutblock__button aboutblock__button--primary" href="<?php echo esc_url( $primary_url ); ?>">
							<?php echo esc_html( $primary_label ); ?>
						</a>
					<?php endif; ?>

					<?php if ( $secondary_label && $secondary_url ) : ?>
						<a class="aboutblock__button aboutblock__button--ghost" href="<?php echo esc_url( $secondary_url ); ?>">
							<?php echo esc_html( $secondary_label ); ?>
						</a>
					<?php endif; ?>
				</nav>
			<?php endif; ?>
		</article>

		<div class="aboutblock__image">
			<?php if ( $image_html ) : ?>
				<figure class="aboutblock__image-card">
					<?php echo $image_html; ?>
				</figure>
			<?php else : ?>
				<div class="aboutblock__image-card aboutblock__image-placeholder" role="img" aria-label="<?php echo esc_attr__( 'Add an about image', 'ogig' ); ?>">
					<span><?php echo esc_html__( 'Add an about image', 'ogig' ); ?></span>
				</div>
			<?php endif; ?>
		</div>

		<?php if ( $has_trust ) : ?>
			<aside class="aboutblock__trust" aria-labelledby="<?php echo esc_attr( $trust_title_id ); ?>">

				<?php if ( $highlights_heading !== '' ) : ?>
					<<?php echo tag_escape( $trust_tag ); ?> id="<?php echo esc_attr( $trust_title_id ); ?>" class="aboutblock__trust-heading">
						<?php echo esc_html( $highlights_heading ); ?>
					</<?php echo tag_escape( $trust_tag ); ?>>
				<?php endif; ?>

				<?php if ( $highlights_intro !== '' ) : ?>
					<p class="aboutblock__trust-intro"><?php echo esc_html( $highlights_intro ); ?></p>
				<?php endif; ?>

				<dl class="aboutblock__highlights">
					<?php if ( $has_h1 ) : ?>
						<div class="aboutblock__highlight">
							<dt class="aboutblock__highlight-value"><?php echo esc_html( $h1_value ); ?></dt>
							<dd class="aboutblock__highlight-label"><?php echo esc_html( $h1_label ); ?></dd>
						</div>
					<?php endif; ?>

					<?php if ( $has_h2 ) : ?>
						<div class="aboutblock__highlight">
							<dt class="aboutblock__highlight-value"><?php echo esc_html( $h2_value ); ?></dt>
							<dd class="aboutblock__highlight-label"><?php echo esc_html( $h2_label ); ?></dd>
						</div>
					<?php endif; ?>

					<?php if ( $has_h3 ) : ?>
						<div class="aboutblock__highlight">
							<dt class="aboutblock__highlight-value"><?php echo esc_html( $h3_value ); ?></dt>
							<dd class="aboutblock__highlight-label"><?php echo esc_html( $h3_label ); ?></dd>
						</div>
					<?php endif; ?>
				</dl>
			</aside>
		<?php endif; ?>

	</div>
</section>