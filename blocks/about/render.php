<?php
/**
 * Server-rendered About block
 * - Full-bleed background independent of alignfull support
 * - Inner content follows global width via alignwide
 * - Watermark: TEXT (optional)
 * - Optional heading level (defaults to h2)
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// Content
$kicker   = isset( $attributes['kicker'] ) ? trim( (string) $attributes['kicker'] ) : '';
$heading  = isset( $attributes['heading'] ) ? trim( (string) $attributes['heading'] ) : '';
$subtitle = isset( $attributes['subtitle'] ) ? trim( (string) $attributes['subtitle'] ) : '';
$body     = isset( $attributes['body'] ) ? (string) $attributes['body'] : '';

// Stamp text (watermark text)
$bg_stamp = isset( $attributes['bgStamp'] ) ? trim( (string) $attributes['bgStamp'] ) : '';

// Optional: allow disabling text watermark if you want only the contour watermark
$disable_text_wm = ! empty( $attributes['disableWatermarkText'] );

// Optional heading level (1-6). If not provided, use h2.
$level = isset( $attributes['headingLevel'] ) ? (int) $attributes['headingLevel'] : 2;
if ( $level < 1 || $level > 6 ) $level = 2;
$heading_tag = 'h' . $level;

// Buttons
$primary_label   = isset( $attributes['primaryButtonLabel'] ) ? trim( (string) $attributes['primaryButtonLabel'] ) : '';
$primary_url_raw = isset( $attributes['primaryButtonUrl'] ) ? (string) $attributes['primaryButtonUrl'] : '';
$primary_url     = $primary_url_raw ? esc_url( $primary_url_raw ) : '';

$secondary_label   = isset( $attributes['secondaryButtonLabel'] ) ? trim( (string) $attributes['secondaryButtonLabel'] ) : '';
$secondary_url_raw = isset( $attributes['secondaryButtonUrl'] ) ? (string) $attributes['secondaryButtonUrl'] : '';
$secondary_url     = $secondary_url_raw ? esc_url( $secondary_url_raw ) : '';

// Highlights
$h1_value = isset( $attributes['highlight1Value'] ) ? trim( (string) $attributes['highlight1Value'] ) : '';
$h1_label = isset( $attributes['highlight1Label'] ) ? trim( (string) $attributes['highlight1Label'] ) : '';

$h2_value = isset( $attributes['highlight2Value'] ) ? trim( (string) $attributes['highlight2Value'] ) : '';
$h2_label = isset( $attributes['highlight2Label'] ) ? trim( (string) $attributes['highlight2Label'] ) : '';

$h3_value = isset( $attributes['highlight3Value'] ) ? trim( (string) $attributes['highlight3Value'] ) : '';
$h3_label = isset( $attributes['highlight3Label'] ) ? trim( (string) $attributes['highlight3Label'] ) : '';

// Image
$image_id   = isset( $attributes['imageId'] ) ? absint( $attributes['imageId'] ) : 0;
$image_html = '';

if ( $image_id ) {
  $image_html = wp_get_attachment_image(
    $image_id,
    'large',
    false,
    array(
      'class'    => 'aboutblock__image-media',
      'loading'  => 'lazy',
      'decoding' => 'async',
    )
  );
}

// Fallbacks
if ( $heading === '' ) $heading = __( 'Precision Manufacturing Built to Last', 'ogig' );
if ( $kicker === '' )  $kicker  = __( 'About Us', 'ogig' );

// Sanitize body (allow rich text)
$body_safe = wp_kses_post( $body );

// Watermark text (default to IG)
$watermark_text = $bg_stamp !== '' ? $bg_stamp : 'IG';

// Allow ONLY <br>, and support newlines OG\nIG
$watermark_safe = wp_kses( $watermark_text, array( 'br' => array() ) );
$watermark_safe = nl2br( $watermark_safe, false );

// Unique title id for aria-labelledby
$title_id = 'aboutblock-title-' . wp_unique_id();
?>

<section class="aboutblock aboutblock--light alignfull" aria-labelledby="<?php echo esc_attr( $title_id ); ?>">
  <div class="aboutblock__inner alignwide" data-aos="fade-up">

    <?php
    $wm_icon_class = isset($attributes['watermarkIconClass']) ? trim((string)$attributes['watermarkIconClass']) : '';
    $use_icon = $wm_icon_class !== '';
    ?>

    <?php if ( ! $disable_text_wm ) : ?>
      <div class="aboutblock__watermark" aria-hidden="true">
        <i class="fa-solid fa-gear"></i>
      </div>
    <?php endif; ?>

    <div class="aboutblock__content">
      <?php if ( $kicker ) : ?>
        <p class="aboutblock__kicker"><?php echo esc_html( $kicker ); ?></p>
      <?php endif; ?>

      <<?php echo tag_escape( $heading_tag ); ?> id="<?php echo esc_attr( $title_id ); ?>" class="aboutblock__title">
        <?php echo esc_html( $heading ); ?>
      </<?php echo tag_escape( $heading_tag ); ?>>

      <?php if ( $subtitle ) : ?>
        <p class="aboutblock__subtitle"><?php echo esc_html( $subtitle ); ?></p>
      <?php endif; ?>

      <?php if ( trim( wp_strip_all_tags( $body_safe ) ) !== '' ) : ?>
        <div class="aboutblock__body"><?php echo $body_safe; ?></div>
      <?php endif; ?>

      <?php if ( $primary_label || $secondary_label ) : ?>
        <div class="aboutblock__cta-row">
          <?php if ( $primary_label ) : ?>
            <a class="aboutblock__button aboutblock__button--primary" href="<?php echo $primary_url ?: '#'; ?>">
              <?php echo esc_html( $primary_label ); ?>
            </a>
          <?php endif; ?>

          <?php if ( $secondary_label ) : ?>
            <a class="aboutblock__button aboutblock__button--ghost" href="<?php echo $secondary_url ?: '#'; ?>">
              <?php echo esc_html( $secondary_label ); ?>
            </a>
          <?php endif; ?>
        </div>
      <?php endif; ?>

      <?php if ( ( $h1_value && $h1_label ) || ( $h2_value && $h2_label ) || ( $h3_value && $h3_label ) ) : ?>
        <div class="aboutblock__highlights" aria-label="<?php echo esc_attr__( 'Highlights', 'ogig' ); ?>">
          <?php if ( $h1_value && $h1_label ) : ?>
            <div class="aboutblock__highlight">
              <div class="aboutblock__highlight-value"><?php echo esc_html( $h1_value ); ?></div>
              <div class="aboutblock__highlight-label"><?php echo esc_html( $h1_label ); ?></div>
            </div>
          <?php endif; ?>

          <?php if ( $h2_value && $h2_label ) : ?>
            <div class="aboutblock__highlight">
              <div class="aboutblock__highlight-value"><?php echo esc_html( $h2_value ); ?></div>
              <div class="aboutblock__highlight-label"><?php echo esc_html( $h2_label ); ?></div>
            </div>
          <?php endif; ?>

          <?php if ( $h3_value && $h3_label ) : ?>
            <div class="aboutblock__highlight">
              <div class="aboutblock__highlight-value"><?php echo esc_html( $h3_value ); ?></div>
              <div class="aboutblock__highlight-label"><?php echo esc_html( $h3_label ); ?></div>
            </div>
          <?php endif; ?>
        </div>
      <?php endif; ?>
    </div>

    <div class="aboutblock__image">
      <div class="aboutblock__image-card">
        <?php if ( $image_html ) : ?>
          <?php echo $image_html; ?>
        <?php else : ?>
          <div class="aboutblock__image-placeholder">
            <span><?php echo esc_html__( 'Add an about image', 'ogig' ); ?></span>
          </div>
        <?php endif; ?>
      </div>
    </div>

  </div>
</section>
