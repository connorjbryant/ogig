<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$eyebrow  = isset( $attributes['eyebrow'] ) ? trim( (string) $attributes['eyebrow'] ) : '';
$heading  = isset( $attributes['heading'] ) ? trim( (string) $attributes['heading'] ) : '';
$body     = isset( $attributes['body'] ) ? trim( (string) $attributes['body'] ) : '';

$primary_label = isset( $attributes['primaryButtonLabel'] ) ? trim( (string) $attributes['primaryButtonLabel'] ) : '';
$primary_url   = isset( $attributes['primaryButtonUrl'] ) ? esc_url( $attributes['primaryButtonUrl'] ) : '#';

$secondary_label = isset( $attributes['secondaryButtonLabel'] ) ? trim( (string) $attributes['secondaryButtonLabel'] ) : '';
$secondary_url   = isset( $attributes['secondaryButtonUrl'] ) ? esc_url( $attributes['secondaryButtonUrl'] ) : '#';

$stat1_value = isset( $attributes['stat1Value'] ) ? trim( (string) $attributes['stat1Value'] ) : '';
$stat1_label = isset( $attributes['stat1Label'] ) ? trim( (string) $attributes['stat1Label'] ) : '';

$stat2_value = isset( $attributes['stat2Value'] ) ? trim( (string) $attributes['stat2Value'] ) : '';
$stat2_label = isset( $attributes['stat2Label'] ) ? trim( (string) $attributes['stat2Label'] ) : '';

$stat3_value = isset( $attributes['stat3Value'] ) ? trim( (string) $attributes['stat3Value'] ) : '';
$stat3_label = isset( $attributes['stat3Label'] ) ? trim( (string) $attributes['stat3Label'] ) : '';

$image_id   = isset( $attributes['imageId'] ) ? absint( $attributes['imageId'] ) : 0;
$image_html = '';

if ( $image_id ) {
    $image_html = wp_get_attachment_image(
        $image_id,
        'large',
        false,
        array(
            'class'    => 'heroblock__image-media',
            'loading'  => 'eager',
            'decoding' => 'async',
        )
    );
}
?>
<section class="heroblock alignfull">
  <div class="heroblock__inner" data-aos="zoom-in">
    <div class="heroblock__content">
      <?php if ( $eyebrow ) : ?>
        <p class="heroblock__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
      <?php endif; ?>

      <h1 class="heroblock__title">
        <?php
        echo $heading !== ''
          ? esc_html( $heading )
          : esc_html__( 'Precision Magnetic Solutions for Precast Excellence', 'ogig' );
        ?>
      </h1>

      <?php if ( $body ) : ?>
        <p class="heroblock__body"><?php echo esc_html( $body ); ?></p>
      <?php endif; ?>

      <div class="heroblock__cta-row">
        <?php if ( $primary_label ) : ?>
          <a class="heroblock__button heroblock__button--primary" href="<?php echo $primary_url ?: '#'; ?>">
            <?php echo esc_html( $primary_label ); ?>
          </a>
        <?php endif; ?>

        <?php if ( $secondary_label ) : ?>
          <a class="heroblock__button heroblock__button--ghost" href="<?php echo $secondary_url ?: '#'; ?>">
            <?php echo esc_html( $secondary_label ); ?>
          </a>
        <?php endif; ?>
      </div>

      <div class="heroblock__stats" aria-label="<?php esc_attr_e( 'Key results', 'ogig' ); ?>">
        <?php if ( $stat1_value && $stat1_label ) : ?>
          <div class="heroblock__stat">
            <div class="heroblock__stat-value"><?php echo esc_html( $stat1_value ); ?></div>
            <div class="heroblock__stat-label"><?php echo esc_html( $stat1_label ); ?></div>
          </div>
        <?php endif; ?>

        <?php if ( $stat2_value && $stat2_label ) : ?>
          <div class="heroblock__stat">
            <div class="heroblock__stat-value"><?php echo esc_html( $stat2_value ); ?></div>
            <div class="heroblock__stat-label"><?php echo esc_html( $stat2_label ); ?></div>
          </div>
        <?php endif; ?>

        <?php if ( $stat3_value && $stat3_label ) : ?>
          <div class="heroblock__stat">
            <div class="heroblock__stat-value"><?php echo esc_html( $stat3_value ); ?></div>
            <div class="heroblock__stat-label"><?php echo esc_html( $stat3_label ); ?></div>
          </div>
        <?php endif; ?>
      </div>
    </div>

    <div class="heroblock__image">
      <div class="heroblock__image-card">
        <?php if ( $image_html ) : ?>
          <?php echo $image_html; ?>
        <?php else : ?>
          <div class="heroblock__image-placeholder">
            <span><?php esc_html_e( 'Add a hero image', 'ogig' ); ?></span>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
