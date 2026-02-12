<?php
/**
 * Template Part: OGIG – Feature Cards (3-up)
 * Icon fields are TEXT like: flaticon-engineer
 */

$bg_image = get_field('fc_bg_image');  // image array (optional)
$heading  = get_field('fc_heading');   // text (optional)

$cards = [
  [
    'icon'     => (string) get_field('fc_card_1_icon'),
    'title'    => (string) get_field('fc_card_1_title'),
    'subtitle' => (string) get_field('fc_card_1_subtitle'),
    'text'     => (string) get_field('fc_card_1_text'),
  ],
  [
    'icon'     => (string) get_field('fc_card_2_icon'),
    'title'    => (string) get_field('fc_card_2_title'),
    'subtitle' => (string) get_field('fc_card_2_subtitle'),
    'text'     => (string) get_field('fc_card_2_text'),
  ],
  [
    'icon'     => (string) get_field('fc_card_3_icon'),
    'title'    => (string) get_field('fc_card_3_title'),
    'subtitle' => (string) get_field('fc_card_3_subtitle'),
    'text'     => (string) get_field('fc_card_3_text'),
  ],
];

// Keep only cards with something filled out
$cards = array_values(array_filter($cards, function ($c) {
  return !empty($c['icon']) || !empty($c['title']) || !empty($c['subtitle']) || !empty($c['text']);
}));

if (empty($cards) && empty($heading)) {
  return;
}

// inline sanitizer (no global function = no redeclare fatal)
$sanitize_icon_class = function ($raw) {
  $raw = trim((string) $raw);
  if ($raw === '') return '';
  $raw = preg_replace('/[^a-zA-Z0-9\-\_\s]/', '', $raw);
  $raw = preg_replace('/\s+/', ' ', $raw);
  return trim($raw);
};

$bg_style = '';
if (!empty($bg_image) && is_array($bg_image) && !empty($bg_image['url'])) {
  $bg_style = "background-image:url('" . esc_url($bg_image['url']) . "')";
}
?>

<section class="ogig-fc" <?php if ($bg_style) echo 'style="' . esc_attr($bg_style) . '"'; ?>>
  <div class="ogig-fc__overlay" aria-hidden="true"></div>

  <div class="ogig-fc__inner site-container">
    <?php if (!empty($heading)) : ?>
      <h2 class="ogig-fc__title" data-aos="fade-down"><?php echo esc_html($heading); ?></h2>
    <?php endif; ?>

    <?php if (!empty($cards)) : ?>
      <div class="ogig-fc__grid" data-aos="zoom-in">
        <?php foreach ($cards as $i => $card): ?>
          <?php
            $icon_class  = $sanitize_icon_class($card['icon']);
            $is_featured = ($i === 1) ? ' is-featured' : '';
          ?>
          <article class="ogig-fc__card<?php echo esc_attr($is_featured); ?>">

            <?php if (!empty($icon_class)): ?>
                <div class="ogig-fc__icon" aria-hidden="true">
                    <i class="<?php echo esc_attr($icon_class); ?>"></i>
                </div>
            <?php endif; ?>

            <?php if (!empty($card['title'])): ?>
              <h3 class="ogig-fc__card-title"><?php echo esc_html($card['title']); ?></h3>
            <?php endif; ?>

            <?php if (!empty($card['subtitle'])): ?>
              <div class="ogig-fc__card-subtitle"><?php echo esc_html($card['subtitle']); ?></div>
            <?php endif; ?>

            <?php if (!empty($card['text'])): ?>
              <div class="ogig-fc__card-text"><?php echo wp_kses_post(nl2br(esc_html($card['text']))); ?></div>
            <?php endif; ?>

          </article>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</section>