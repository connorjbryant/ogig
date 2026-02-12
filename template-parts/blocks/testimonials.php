<?php
/**
 * Template Part: OGIG – Testimonials (CPT Query)
 * Shortcode: [ogig_testimonials]
 *
 * Page/Section fields (on the page):
 *  - t_heading (text)
 *  - t_subheading (textarea)
 *  - t_bg_image (image array optional)
 *  - t_anchor_id (text optional)
 *
 * CPT fields (on each testimonial post):
 *  - tm_quote (textarea)
 *  - tm_name (text)
 *  - tm_title (text)
 *  - tm_company (text)
 *  - tm_rating (number 0–5)
 *  - tm_avatar (image array optional)
 *  - tm_featured (true/false)
 */

if (!defined('ABSPATH')) exit;

$sc = get_query_var('ogig_tm_sc_atts');
$sc = is_array($sc) ? $sc : [];

$count = isset($sc['count']) ? (int) $sc['count'] : 0; // 0 = all

$featured = !empty($sc['featured']);
$order    = isset($sc['order']) ? $sc['order'] : 'DESC';
$autoplay = !empty($sc['autoplay']);
$interval = isset($sc['interval']) ? (int) $sc['interval'] : 4500;
$anchor   = isset($sc['anchor']) ? (string) $sc['anchor'] : '';

$heading    = (string) get_field('t_heading');
$subheading = (string) get_field('t_subheading');
$bg_image   = get_field('t_bg_image');
$anchor_id  = trim((string) get_field('t_anchor_id'));

$section_id = $anchor !== '' ? $anchor : ($anchor_id !== '' ? $anchor_id : 'ogig-testimonials');

$bg_style = '';
if (!empty($bg_image) && is_array($bg_image) && !empty($bg_image['url'])) {
  $bg_style = "background-image:url('" . esc_url($bg_image['url']) . "')";
}

$args = [
  'post_type'      => 'ogig_testimonial',
  'post_status'    => 'publish',
  'posts_per_page' => ($count <= 0 ? -1 : $count),
  'orderby'        => 'date',
  'order'          => $order,
];

if ($featured) {
  $args['meta_query'] = [
    [
      'key'     => 'tm_featured',
      'value'   => '1',
      'compare' => '=',
    ],
  ];
}

$q = new WP_Query($args);

// DEBUG (remove later)
echo "\n<!-- ogig_testimonials: found_posts={$q->found_posts} posts_per_page={$args['posts_per_page']} -->\n";

$items = [];

if ($q->have_posts()) {
  while ($q->have_posts()) {
    $q->the_post();

    $quote   = (string) get_field('tm_quote');
    $name    = (string) get_field('tm_name');
    $title   = (string) get_field('tm_title');
    $company = (string) get_field('tm_company');
    $rating  = (int) get_field('tm_rating');
    $avatar  = get_field('tm_avatar');

    // fallback to featured image if tm_avatar empty
    if (empty($avatar) && has_post_thumbnail()) {
      $id = get_post_thumbnail_id(get_the_ID());
      $src = wp_get_attachment_image_src($id, 'thumbnail');
      if (!empty($src[0])) {
        $avatar = [
          'url' => $src[0],
          'alt' => get_the_title(),
        ];
      }
    }

    // Fallbacks (so a post doesn't disappear if an ACF field is empty)
    if (trim($name) === '') {
    $name = get_the_title();
    }

    if (trim($quote) === '') {
    $quote = has_excerpt() ? get_the_excerpt() : '';
    }

    // Skip only if STILL empty after fallbacks
    if (trim($quote) === '' && trim($name) === '') {
    continue;
    }



    $items[] = [
      'quote'   => $quote,
      'name'    => $name,
      'title'   => $title,
      'company' => $company,
      'rating'  => $rating,
      'avatar'  => $avatar,
    ];
  }
  wp_reset_postdata();
}

if (empty($items) && $heading === '' && $subheading === '') {
  return;
}
// DEBUG (remove later)
echo "\n<!-- ogig_testimonials: rendered_items=" . count($items) . " -->\n";

// build grid class helpers
$count_class = 'has-' . count($items);
if (count($items) >= 4) $count_class = 'has-4plus';

// data attributes used by JS autoplay
$data_autoplay = $autoplay ? '1' : '0';
$data_interval = max(2000, $interval);
?>

<section
  id="<?php echo esc_attr($section_id); ?>"
  class="ogig-tm"
  <?php if ($bg_style) echo 'style="' . esc_attr($bg_style) . '"'; ?>
  data-ogig-tm-autoplay="<?php echo esc_attr($data_autoplay); ?>"
  data-ogig-tm-interval="<?php echo esc_attr($data_interval); ?>"
>
  <div class="ogig-tm__overlay" aria-hidden="true"></div>

  <div class="ogig-tm__inner site-container">
    <?php if ($heading !== '' || $subheading !== ''): ?>
      <header class="ogig-tm__head" data-aos="fade-down">
        <?php if ($heading !== ''): ?>
          <h2 class="ogig-tm__heading"><?php echo esc_html($heading); ?></h2>
        <?php endif; ?>
        <?php if ($subheading !== ''): ?>
          <div class="ogig-tm__subheading"><?php echo wp_kses_post(nl2br(esc_html($subheading))); ?></div>
        <?php endif; ?>
      </header>
    <?php endif; ?>

    <?php if (!empty($items)): ?>
      <div class="ogig-tm__grid <?php echo esc_attr($count_class); ?>" data-aos="zoom-in">
        <?php foreach ($items as $i => $t): ?>
          <?php
            $is_featured = ($i === 1) ? ' is-featured' : '';
            $name = trim($t['name']);
            $meta_parts = array_filter([ trim($t['title']), trim($t['company']) ]);
            $meta = implode(' • ', $meta_parts);

            $has_avatar = !empty($t['avatar']) && is_array($t['avatar']) && !empty($t['avatar']['url']);
            $rating_html = function_exists('ogig_render_stars') ? ogig_render_stars($t['rating']) : '';
          ?>

          <article class="ogig-tm__card<?php echo esc_attr($is_featured); ?>">
            <div class="ogig-tm__quote-mark" aria-hidden="true">“</div>

            <?php if ($rating_html): ?>
              <?php echo $rating_html; ?>
            <?php endif; ?>

            <?php if (trim($t['quote']) !== ''): ?>
              <div class="ogig-tm__quote"><?php echo wp_kses_post(nl2br(esc_html($t['quote']))); ?></div>
            <?php endif; ?>

            <div class="ogig-tm__footer">
              <?php if ($has_avatar): ?>
                <div class="ogig-tm__avatar">
                  <img
                    src="<?php echo esc_url($t['avatar']['url']); ?>"
                    alt="<?php echo esc_attr($t['avatar']['alt'] ?? $name); ?>"
                    loading="lazy"
                  />
                </div>
              <?php endif; ?>

              <div class="ogig-tm__who">
                <?php if ($name !== ''): ?>
                  <div class="ogig-tm__name"><?php echo esc_html($name); ?></div>
                <?php endif; ?>
                <?php if ($meta !== ''): ?>
                  <div class="ogig-tm__meta"><?php echo esc_html($meta); ?></div>
                <?php endif; ?>
              </div>
            </div>
          </article>

        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</section>