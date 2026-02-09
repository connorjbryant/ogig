<?php
/**
 * Block: OGIG – Product Cards Hero (ACF Free – 3 fixed cards)
 */

$block_id = 'ogig-pch-' . ($block['id'] ?? uniqid());
$classes  = 'ogig-pch';
if (!empty($block['className'])) $classes .= ' ' . $block['className'];
if (!empty($block['align']))     $classes .= ' align' . $block['align'];

$bg_image = get_field('bg_image');  // image array
$heading  = get_field('heading');   // text

// Card 1
$c1_title = get_field('card_1_title');
$c1_img   = get_field('card_1_image');
$c1_btn_t = get_field('card_1_button_text');
$c1_btn_u = get_field('card_1_button_url');

// Card 2
$c2_title = get_field('card_2_title');
$c2_img   = get_field('card_2_image');
$c2_btn_t = get_field('card_2_button_text');
$c2_btn_u = get_field('card_2_button_url');

// Card 3
$c3_title = get_field('card_3_title');
$c3_img   = get_field('card_3_image');
$c3_btn_t = get_field('card_3_button_text');
$c3_btn_u = get_field('card_3_button_url');

$cards = [
  [
    'title' => $c1_title,
    'img'   => $c1_img,
    'btn_t' => $c1_btn_t,
    'btn_u' => $c1_btn_u,
  ],
  [
    'title' => $c2_title,
    'img'   => $c2_img,
    'btn_t' => $c2_btn_t,
    'btn_u' => $c2_btn_u,
  ],
  [
    'title' => $c3_title,
    'img'   => $c3_img,
    'btn_t' => $c3_btn_t,
    'btn_u' => $c3_btn_u,
  ],
];

// Count how many cards actually have content so we can auto-center if only 1–2 used
$active_cards = array_values(array_filter($cards, function($c){
  return !empty($c['title']) || !empty($c['img']) || !empty($c['btn_u']);
}));
$active_count = count($active_cards);
?>

<section id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($classes); ?>" data-cards="<?php echo esc_attr($active_count); ?>">
  <div class="ogig-pch__bg"
    <?php if (!empty($bg_image['url'])): ?>
      style="background-image:url('<?php echo esc_url($bg_image['url']); ?>')"
    <?php endif; ?>
  ></div>

  <div class="ogig-pch__overlay" aria-hidden="true"></div>

  <div class="ogig-pch__inner site-container">
    <?php if (!empty($heading)) : ?>
      <h2 class="ogig-pch__title" data-aos="fade-down"><?php echo esc_html($heading); ?></h2>
    <?php endif; ?>

    <?php if ($active_count > 0) : ?>
      <div class="ogig-pch__grid" data-aos="zoom-in">
        <?php foreach ($active_cards as $card): ?>
          <article class="ogig-pch__card">
            <?php if (!empty($card['title'])): ?>
              <h3 class="ogig-pch__card-title"><?php echo esc_html($card['title']); ?></h3>
            <?php endif; ?>

            <div class="ogig-pch__card-media">
              <?php if (!empty($card['img']['url'])): ?>
                <img
                  src="<?php echo esc_url($card['img']['url']); ?>"
                  alt="<?php echo esc_attr($card['img']['alt'] ?? $card['title']); ?>"
                  loading="lazy"
                />
              <?php endif; ?>
            </div>

            <?php if (!empty($card['btn_u'])): ?>
              <a class="ogig-pch__btn" href="<?php echo esc_url($card['btn_u']); ?>">
                <?php echo esc_html(!empty($card['btn_t']) ? $card['btn_t'] : 'Learn More'); ?>
              </a>
            <?php endif; ?>
          </article>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</section>